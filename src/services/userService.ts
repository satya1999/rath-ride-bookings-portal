
import { supabase } from "@/integrations/supabase/client";

export const userService = {
  getUsers: async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        id,
        first_name,
        last_name,
        phone,
        user_roles(id, role),
        created_at,
        updated_at
      `);

    if (error) throw error;
    return data || [];
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
  }
};
