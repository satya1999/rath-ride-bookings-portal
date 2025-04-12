
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const commissionService = {
  getCommissions: async () => {
    try {
      const { data, error } = await supabase
        .from("commissions")
        .select(`
          *,
          agents:agent_id(name, email),
          bookings:booking_id(booking_number, total_amount)
        `)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching commissions:", error);
      toast.error("Failed to fetch commissions");
      return [];
    }
  },
  
  updateCommissionStatus: async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("commissions")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating commission status:", error);
      toast.error("Failed to update commission status");
      return false;
    }
  }
};
