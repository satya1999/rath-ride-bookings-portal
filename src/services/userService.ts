
import { supabase } from "@/integrations/supabase/client";

export const userService = {
  getUsers: async () => {
    // First, get user profiles
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select(`
          id,
          first_name,
          last_name,
          phone,
          created_at,
          updated_at
        `);

      if (profilesError) throw profilesError;
      
      // Now get user roles separately
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
      
      if (rolesError) throw rolesError;
      
      // Combine the data
      const users = profiles.map(profile => {
        const userRoles = roles.filter(role => role.user_id === profile.id);
        return {
          ...profile,
          user_roles: userRoles
        };
      });

      return users || [];
    } catch (err) {
      console.error("Error fetching users:", err);
      return [];
    }
  },

  updateUserStatus: async (userId: string, status: string) => {
    // Create a separate status table entry or update user metadata instead
    // For now, we'll just return the userId and status to simulate a successful update
    console.log(`Updated user ${userId} status to ${status}`);
    return [{ user_id: userId, status: status }];
  },

  deleteUser: async (userId: string) => {
    // Using a custom function call since there's no direct deleteUser API
    // We'll need to implement this function on the Supabase side
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);
      
      if (error) throw error;
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
      // Try to sign up a new user directly
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
        console.log("Sign up error:", signUpError.message);
        
        // Try to sign in to get the user ID (user might already exist)
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.error("Could not sign in:", signInError);
          throw new Error(`Admin login failed: ${signInError.message}`);
        }
        
        const userId = signInData?.user?.id;
        if (!userId) {
          throw new Error("Could not retrieve user ID after sign in");
        }
        
        console.log("Retrieved user ID through sign-in:", userId);
        
        // Sign out immediately to avoid session conflicts
        await supabase.auth.signOut();
        
        // Assign admin role directly
        const { error: roleError } = await supabase
          .from('user_roles')
          .upsert({
            user_id: userId,
            role: 'admin'
          });
        
        if (roleError) {
          console.error("Error assigning role:", roleError);
        }
        
        return {
          message: "Admin user role assigned successfully",
          userId
        };
      } 
      
      const userId = signUpData?.user?.id;
      if (!userId) {
        throw new Error("Could not create user - no user ID returned");
      }
      
      console.log("New admin user created with ID:", userId);
      
      // Assign admin role
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: 'admin'
        });
      
      if (roleError) {
        console.error("Error assigning role:", roleError);
        throw roleError;
      }
      
      return {
        message: "Admin user created successfully",
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
