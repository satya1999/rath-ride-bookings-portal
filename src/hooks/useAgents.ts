
import { useState, useEffect } from "react";
import { agentService } from "@/services";
import { toast } from "sonner";

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  commission_rate: number;
  status: string;
  joined_at: string;
  updated_at: string;
  joined: string; // Added for compatibility
  bookings?: number;
  commissions?: string;
}

export interface AddAgentFormValues {
  name: string;
  email: string;
  phone?: string;
  password: string;
  commission: number;
}

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchAgents = async () => {
    setLoading(true);
    try {
      const data = await agentService.getAgents();
      // Transform to the expected format
      const formattedAgents = data.map(agent => ({
        ...agent,
        joined: agent.joined_at, // Add joined property for compatibility
        bookings: 0, // These would be calculated from actual data
        commissions: "₹0" // These would be calculated from actual data
      }));
      setAgents(formattedAgents);
    } catch (error) {
      console.error("Error in useAgents:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchAgents();
  }, []);
  
  const handleStatusChange = async (agentId: string, newStatus: string) => {
    const result = await agentService.updateAgentStatus(agentId, newStatus);
    if (result) {
      setAgents(
        agents.map(agent => 
          agent.id === agentId ? { ...agent, status: newStatus } : agent
        )
      );
      
      const agent = agents.find(a => a.id === agentId);
      if (agent) {
        toast.success(`Agent ${agent.name} ${newStatus === "active" ? "activated" : "deactivated"}`);
      }
    }
  };
  
  const handleAddAgent = async (data: AddAgentFormValues) => {
    const result = await agentService.addAgent(data);
    if (result) {
      toast.success(`Agent ${data.name} created successfully`);
      fetchAgents(); // Reload the list
      return true;
    }
    return false;
  };
  
  return {
    agents,
    loading,
    handleStatusChange,
    handleAddAgent,
    refetch: fetchAgents
  };
}
