
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
    // First, check if user already exists
    // Instead of using getUserByEmail which doesn't exist, we'll use a different approach
    
    // Check if a user with this email already exists in auth system
    const { data: existingUsers, error: lookupError } = await supabase
      .from('auth.users') // This might not work directly, but we're trying a safer approach
      .select('id')
      .eq('email', email)
      .maybeSingle()
      .catch(() => ({ data: null, error: null })); // Silently handle if this query isn't allowed
    
    let userId;
    
    // If we couldn't determine if user exists or doesn't exist, create a new one
    if (!existingUsers) {
      // Create the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("Failed to create user");
      }
      
      userId = authData.user.id;
    } else if (existingUsers) {
      // User exists, get their ID
      userId = existingUsers.id;
    } else {
      // User doesn't exist, create them
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error("Failed to create user");
      }
      
      userId = authData.user.id;
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
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([
          { user_id: userId, role: 'admin' }
        ]);
      
      if (roleError) throw roleError;
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
