
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const agentService = {
  getAgents: async () => {
    try {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("name");
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Failed to fetch agents");
      return [];
    }
  },
  
  updateAgentStatus: async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("agents")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating agent status:", error);
      toast.error("Failed to update agent status");
      return false;
    }
  },
  
  addAgent: async (agentData: any) => {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: agentData.email,
        password: agentData.password,
        email_confirm: true,
      });
      
      if (authError) throw authError;
      
      // Then create agent record
      const { error } = await supabase
        .from("agents")
        .insert({
          id: authData.user.id,
          name: agentData.name,
          email: agentData.email,
          commission_rate: agentData.commission || 10,
        });
        
      if (error) throw error;
      
      // Update user role to agent
      const { error: roleError } = await supabase
        .from("user_roles")
        .update({ role: "agent" })
        .eq("user_id", authData.user.id);
        
      if (roleError) throw roleError;
      
      return true;
    } catch (error) {
      console.error("Error adding agent:", error);
      toast.error("Failed to add agent");
      return false;
    }
  }
};
