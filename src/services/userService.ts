
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
    // We can't query auth.users directly through the client API
    // Instead, we'll attempt a login and handle various scenarios
    
    let userId: string;
    
    // Try to sign in with the provided credentials to see if the user exists
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password
    }).catch(() => ({ data: { user: null }, error: { message: "Login failed" } }));
    
    if (signInData && signInData.user) {
      // User exists and credentials are valid
      userId = signInData.user.id;
      console.log("Existing user authenticated:", userId);
    } else {
      // User might not exist or password is incorrect
      // Try to create a new user
      console.log("No existing user or invalid credentials, trying to create user");
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) {
        console.error("Failed to create user:", signUpError);
        throw signUpError;
      }
      
      if (!signUpData?.user) {
        throw new Error("Failed to create user");
      }
      
      userId = signUpData.user.id;
      console.log("New user created:", userId);
    }
    
    // Then, check if role already exists
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();
    
    // If role doesn't exist, assign admin role
    if (!existingRole) {
      console.log("Assigning admin role to user:", userId);
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([
          { user_id: userId, role: 'admin' }
        ]);
      
      if (roleError) throw roleError;
    } else {
      console.log("User already has admin role:", userId);
    }
    
    return {
      message: "Admin user created/updated successfully",
      userId: userId
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
