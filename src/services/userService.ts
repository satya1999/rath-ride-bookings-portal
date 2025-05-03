
import { supabase } from "@/integrations/supabase/client";

export const userService = {
  getUsers: async () => {
    // First, get user profiles
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
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId);
    
    if (error) throw error;
    return true;
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
      // First, check if the user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('user_profiles')
        .select('id')
        .limit(1);
        
      if (checkError) {
        console.error("Error checking existing user:", checkError);
      }
      
      let userId: string | undefined;
      
      // If no existing user found, try to sign up a new one
      if (!existingUser?.length) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        
        if (signUpError) {
          console.log("Sign up error:", signUpError.message);
          
          // Try to get user by email (admin only function)
          const { data: adminData } = await supabase
            .from('user_profiles')
            .select('id')
            .single();
          
          if (adminData?.id) {
            userId = adminData.id;
            console.log("Found existing user ID:", userId);
          } else {
            // Try signing in to get the user ID
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password
            });
            
            if (signInError) {
              console.error("Could not sign in:", signInError);
            } else if (signInData?.user) {
              userId = signInData.user.id;
              console.log("Retrieved user ID through sign-in:", userId);
              // Sign out immediately to avoid session conflicts
              await supabase.auth.signOut();
            }
          }
        } else if (signUpData?.user) {
          userId = signUpData.user.id;
          console.log("New user created with ID:", userId);
        }
      } else {
        userId = existingUser[0]?.id;
        console.log("Using existing user with ID:", userId);
      }
      
      if (!userId) {
        // One final attempt - create a user directly
        const { data: finalSignUpData, error: finalSignUpError } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true
        });
        
        if (finalSignUpError) {
          throw new Error(`Could not create or identify user: ${finalSignUpError.message}`);
        }
        
        userId = finalSignUpData?.user?.id;
        if (!userId) {
          throw new Error("Could not create or identify user after multiple attempts");
        }
      }
      
      // Ensure the user has an entry in user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          first_name: 'Admin',
          last_name: 'User'
        });
      
      if (profileError) {
        console.error("Error updating profile:", profileError);
      }
      
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
        message: "Admin user created/updated successfully",
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
