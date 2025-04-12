
import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/card";

import { AgentFilters } from "@/components/admin/agents/AgentFilters";
import { AgentSearch } from "@/components/admin/agents/AgentSearch";
import { AgentTable } from "@/components/admin/agents/AgentTable";
import { AddAgentDialog, AddAgentFormValues } from "@/components/admin/agents/AddAgentDialog";
import { useAgents, Agent } from "@/hooks/useAgents";

const AgentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  const { agents, loading, handleStatusChange, handleAddAgent } = useAgents();
  
  const filteredAgents = agents.filter(agent => {
    // Apply search filter
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesStatus = 
      activeFilter === "all" || 
      agent.status === activeFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddAgentSubmit = async (data: AddAgentFormValues) => {
    return await handleAddAgent(data);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Agents Management</h1>
        <AddAgentDialog onAddAgent={handleAddAgentSubmit} />
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <AgentFilters 
            activeFilter={activeFilter} 
            onFilterChange={setActiveFilter} 
          />
          
          <AgentSearch 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
        </div>
      </div>

      <Card>
        <AgentTable 
          agents={filteredAgents} 
          onStatusChange={handleStatusChange}
          loading={loading} 
        />
      </Card>
    </AdminLayout>
  );
};

export default AgentsPage;
