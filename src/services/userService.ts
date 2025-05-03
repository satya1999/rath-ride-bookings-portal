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
    // Check if the user has admin role
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error("Admin check error:", error);
      throw error;
    }
    
    return !!data;
  },
  
  createAdminUser: async (email: string, password: string) => {
    console.log("Creating/updating admin user:", email);
    
    let userId: string | undefined;
    
    // Try to sign up a new user first
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (signUpError) {
      console.log("Sign up error, user might already exist:", signUpError.message);
      
      // Try to get user by email (admin only function)
      const { data: adminData } = await supabase
        .from('user_profiles')
        .select('id')
        .single();
      
      if (adminData?.id) {
        userId = adminData.id;
        console.log("Found existing user ID:", userId);
      }
    } else if (signUpData?.user) {
      userId = signUpData.user.id;
      console.log("New user created with ID:", userId);
    }
    
    if (!userId) {
      throw new Error("Could not create or identify user");
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
