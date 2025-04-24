
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
        user_roles(role),
        created_at,
        updated_at
      `);

    if (error) throw error;
    return data || [];
  },

  updateUserStatus: async (userId: string, status: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .update({ status })
      .eq('user_id', userId)
      .select();

    if (error) throw error;
    return data;
  },

  deleteUser: async (userId: string) => {
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) throw error;
    return true;
  }
};
