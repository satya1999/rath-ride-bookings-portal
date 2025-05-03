
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddAgentFormValues } from "@/hooks/useAgents";

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
  
  addAgent: async (agentData: AddAgentFormValues) => {
    try {
      // First, create auth user with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: agentData.email,
        password: agentData.password,
      });
      
      if (authError) throw authError;
      
      if (!authData?.user) {
        throw new Error("Failed to create user account");
      }
      
      // Then create agent record
      const { error } = await supabase
        .from("agents")
        .insert({
          id: authData.user.id,
          name: agentData.name,
          email: agentData.email,
          phone: agentData.phone || null,
          commission_rate: agentData.commission || 10,
          status: 'active'
        });
        
      if (error) throw error;
      
      // Add user_role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: authData.user.id,
          role: "agent"
        });
        
      if (roleError) throw roleError;
      
      return true;
    } catch (error: any) {
      console.error("Error adding agent:", error);
      toast.error(error.message || "Failed to add agent");
      return false;
    }
  }
};
