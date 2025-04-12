
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const userService = {
  getUsers: async () => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select(`
          id,
          first_name,
          last_name,
          phone,
          created_at
        `)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      // Get user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");
        
      if (rolesError) throw rolesError;
      
      // Map roles to users
      const usersWithRoles = data?.map(user => {
        const userRole = rolesData?.find(role => role.user_id === user.id);
        return {
          ...user,
          role: userRole?.role || "user",
          status: "active" // We'll assume active for now, but this could be enhanced
        };
      });
      
      return usersWithRoles || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      return [];
    }
  }
};
