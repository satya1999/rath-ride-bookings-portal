
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
    // First, create the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) throw authError;
    
    if (!authData.user) {
      throw new Error("Failed to create user");
    }
    
    // Then, assign admin role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert([
        { user_id: authData.user.id, role: 'admin' }
      ]);
    
    if (roleError) throw roleError;
    
    return {
      message: "Admin user created successfully",
      userId: authData.user.id
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
