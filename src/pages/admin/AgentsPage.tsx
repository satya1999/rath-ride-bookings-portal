
import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

import { AgentFilters } from "@/components/admin/agents/AgentFilters";
import { AgentSearch } from "@/components/admin/agents/AgentSearch";
import { AgentTable } from "@/components/admin/agents/AgentTable";
import { AddAgentDialog, AddAgentFormValues } from "@/components/admin/agents/AddAgentDialog";

// Mock data
const agents = [
  {
    id: "1",
    name: "Amit Kumar",
    email: "amit@example.com",
    bookings: 145,
    commissions: "₹32,450",
    status: "active",
    joined: "2023-08-15"
  },
  {
    id: "2",
    name: "Sneha Desai",
    email: "sneha@example.com",
    bookings: 98,
    commissions: "₹21,340",
    status: "active",
    joined: "2023-09-22"
  },
  {
    id: "3",
    name: "Rajiv Singh",
    email: "rajiv@example.com",
    bookings: 167,
    commissions: "₹38,750",
    status: "inactive",
    joined: "2023-07-01"
  },
  {
    id: "4",
    name: "Kavita Sharma",
    email: "kavita@example.com",
    bookings: 82,
    commissions: "₹19,800",
    status: "active",
    joined: "2024-01-10"
  },
  {
    id: "5",
    name: "Prakash Joshi",
    email: "prakash@example.com",
    bookings: 124,
    commissions: "₹27,650",
    status: "inactive",
    joined: "2023-11-05"
  }
];

const AgentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [agentsList, setAgentsList] = useState(agents);
  const [activeFilter, setActiveFilter] = useState("all");
  
  const filteredAgents = agentsList.filter(agent => {
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

  const handleAddAgent = (data: AddAgentFormValues) => {
    // In a real app, you'd make an API call here
    const newAgent = {
      id: `${Date.now()}`,
      name: data.name,
      email: data.email,
      bookings: 0,
      commissions: "₹0",
      status: "active",
      joined: new Date().toISOString().split('T')[0]
    };
    
    setAgentsList([newAgent, ...agentsList]);
    toast.success(`Agent ${data.name} created successfully`);
  };

  const handleStatusChange = (agentId: string, newStatus: string) => {
    setAgentsList(
      agentsList.map(agent => 
        agent.id === agentId ? { ...agent, status: newStatus } : agent
      )
    );
    
    const agent = agentsList.find(a => a.id === agentId);
    if (agent) {
      toast.success(`Agent ${agent.name} ${newStatus === "active" ? "activated" : "deactivated"}`);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Agents Management</h1>
        <AddAgentDialog onAddAgent={handleAddAgent} />
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
        />
      </Card>
    </AdminLayout>
  );
};

export default AgentsPage;
