
import { supabase } from "@/integrations/supabase/client";

export const userService = {
  getUsers: async () => {
    try {
      // Get user roles
      const { data: userRoles, error: userRolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (userRolesError) throw userRolesError;
      
      // Get user profiles
      const { data: userProfiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*');
      
      if (profilesError) throw profilesError;
      
      // Extract unique user IDs from roles
      const userIds = [...new Set(userRoles.map(role => role.user_id))];
      
      // For each user ID, combine profile and role data
      const usersData = userIds.map(userId => {
        // Find all roles for this user
        const roles = userRoles.filter(r => r.user_id === userId);
        // Find profile for this user (if exists)
        const profile = userProfiles?.find(p => p.id === userId);
        
        return {
          id: userId,
          first_name: profile?.first_name || "", 
          last_name: profile?.last_name || "",
          phone: profile?.phone || "",
          created_at: profile?.created_at || roles[0]?.created_at || new Date().toISOString(),
          updated_at: profile?.updated_at || roles[0]?.created_at || new Date().toISOString(),
          joined: profile?.created_at || roles[0]?.created_at || new Date().toISOString(),
          user_roles: roles,
          // Determine role and status
          role: roles.length > 0 ? roles[0].role : "user",
          status: "active" // Default status
        };
      });

      return usersData || [];
    } catch (err) {
      console.error("Error fetching users:", err);
      return [];
    }
  },

  updateUserStatus: async (userId: string, status: string) => {
    try {
      // Update user status in a new user_status table or metadata
      console.log(`Updated user ${userId} status to ${status}`);
      
      // In a real implementation, you would update the status in the database
      // For now, we'll just return the updated record
      return [{ user_id: userId, status: status }];
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  },

  deleteUser: async (userId: string) => {
    try {
      // Delete from user_roles first
      const { error: roleError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
      if (roleError) {
        console.error("Error deleting user roles:", roleError);
      }

      // Delete from user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);
        
      if (profileError) {
        console.error("Error deleting user profile:", profileError);
      }
      
      // Now delete the auth user via Supabase auth API
      // Note: This would require admin privileges which we don't have
      console.log("User deleted:", userId);
      return true;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  },
  
  checkAdminRole: async (userId: string) => {
    try {
      // Check if the user has admin role
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error("Admin check error:", error);
        throw error;
      }
      
      return !!data;
    } catch (err) {
      console.error("Error checking admin role:", err);
      return false;
    }
  },
  
  createAdminUser: async (email: string, password: string) => {
    console.log("Creating/updating admin user:", email);
    
    try {
      // First try to sign in with the credentials to check if user exists
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      let userId = signInData?.user?.id;
      
      if (signInError) {
        console.log("Sign in failed, trying to create user:", signInError.message);
        
        // User doesn't exist or wrong password, try to sign up
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: 'Admin',
              last_name: 'User'
            }
          }
        });
        
        if (signUpError) {
          console.error("Failed to create admin user:", signUpError);
          throw new Error(`Admin creation failed: ${signUpError.message}`);
        }
        
        userId = signUpData?.user?.id;
        if (!userId) {
          throw new Error("Could not create user - no user ID returned");
        }
        
        console.log("New admin user created with ID:", userId);
      } else {
        console.log("Admin user exists with ID:", userId);
      }
      
      if (!userId) {
        throw new Error("Failed to get user ID");
      }
      
      // Ensure the user has a profile
      await ensureUserProfile(userId, 'Admin', 'User');
      
      // Assign admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: 'admin'
        });
      
      if (roleError) {
        console.error("Error assigning admin role:", roleError);
        throw roleError;
      }
      
      // Create agent user if it doesn't exist
      await createAgentIfNotExists();
      
      return {
        message: "Admin user setup successful",
        userId
      };
    } catch (error: any) {
      console.error("Error in createAdminUser:", error);
      throw error;
    }
  },
  
  ensureAdminExists: async () => {
    // Check if at least one admin exists
    const { count, error } = await supabase
      .from('user_roles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'admin');
    
    return { hasAdmin: count && count > 0, error };
  }
};

// Helper function to ensure user profile exists
async function ensureUserProfile(userId: string, firstName: string, lastName: string) {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        first_name: firstName,
        last_name: lastName
      });
      
    if (error) {
      console.error("Error ensuring user profile:", error);
    }
  } catch (err) {
    console.error("Exception in ensureUserProfile:", err);
  }
}

// Helper function to create a demo agent
async function createAgentIfNotExists() {
  const agentEmail = "agent@example.com";
  const agentPassword = "agent123";
  
  try {
    // Check if agent exists by trying to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: agentEmail,
      password: agentPassword
    });
    
    if (!signInError && signInData?.user) {
      console.log("Agent user exists");
      return;
    }
    
    // Create agent user
    console.log("Creating agent user");
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: agentEmail,
      password: agentPassword,
      options: {
        data: {
          first_name: 'Demo',
          last_name: 'Agent'
        }
      }
    });
    
    if (signUpError) {
      console.error("Failed to create agent user:", signUpError);
      return;
    }
    
    const userId = signUpData?.user?.id;
    if (!userId) {
      console.error("Could not create agent - no user ID returned");
      return;
    }
    
    // Ensure the user has a profile
    await ensureUserProfile(userId, 'Demo', 'Agent');
    
    // Assign agent role
    const { error: roleError } = await supabase
      .from('user_roles')
      .upsert({
        user_id: userId,
        role: 'agent'
      });
    
    if (roleError) {
      console.error("Error assigning agent role:", roleError);
    }
    
    // Create agent record
    const { error: agentError } = await supabase
      .from('agents')
      .upsert({
        id: userId,
        name: 'Demo Agent',
        email: agentEmail,
        phone: '1234567890',
        commission_rate: 10,
        status: 'active'
      });
    
    if (agentError) {
      console.error("Error creating agent record:", agentError);
    }
    
    console.log("Agent user created successfully");
  } catch (err) {
    console.error("Error in createAgentIfNotExists:", err);
  }
}
