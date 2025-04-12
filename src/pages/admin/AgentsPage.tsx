
import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, UserCog } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { TextField } from "@/components/admin/settings/form-fields/TextField";
import { NumberField } from "@/components/admin/settings/form-fields/NumberField";
import { AgentActionButtons } from "@/components/admin/agents/AgentActionButtons";

// Form schema
const addAgentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  commission: z.coerce.number().min(0).max(100),
});

type AddAgentFormValues = z.infer<typeof addAgentSchema>;

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
  const [isAddAgentOpen, setIsAddAgentOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  
  const addAgentForm = useForm<AddAgentFormValues>({
    resolver: zodResolver(addAgentSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      commission: 10,
    }
  });

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
    setIsAddAgentOpen(false);
    toast.success(`Agent ${data.name} created successfully`);
    addAgentForm.reset();
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
        <Dialog open={isAddAgentOpen} onOpenChange={setIsAddAgentOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserCog className="mr-2 h-4 w-4" />
              Add Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Agent</DialogTitle>
            </DialogHeader>
            <Form {...addAgentForm}>
              <form onSubmit={addAgentForm.handleSubmit(handleAddAgent)} className="space-y-4">
                <TextField
                  form={addAgentForm}
                  name="name"
                  label="Name"
                />
                <TextField
                  form={addAgentForm}
                  name="email"
                  label="Email"
                  type="email"
                />
                <TextField
                  form={addAgentForm}
                  name="password"
                  label="Password"
                  type="password"
                />
                <NumberField
                  form={addAgentForm}
                  name="commission"
                  label="Commission Rate (%)"
                />
                <Button type="submit" className="w-full">Create Agent</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button 
              variant={activeFilter === "all" ? "default" : "outline"} 
              onClick={() => setActiveFilter("all")}
            >
              All
            </Button>
            <Button 
              variant={activeFilter === "active" ? "default" : "outline"}
              onClick={() => setActiveFilter("active")}
            >
              Active
            </Button>
            <Button 
              variant={activeFilter === "inactive" ? "default" : "outline"}
              onClick={() => setActiveFilter("inactive")}
            >
              Inactive
            </Button>
          </div>
          
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search agents..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Bookings</TableHead>
              <TableHead>Commissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgents.length > 0 ? (
              filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-medium">{agent.name}</TableCell>
                  <TableCell>{agent.email}</TableCell>
                  <TableCell>{agent.bookings}</TableCell>
                  <TableCell>{agent.commissions}</TableCell>
                  <TableCell>
                    <Badge
                      variant={agent.status === "active" ? "default" : "secondary"}
                      className={agent.status === "active" ? "bg-green-600" : ""}
                    >
                      {agent.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(agent.joined).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <AgentActionButtons 
                      agent={agent} 
                      onStatusChange={handleStatusChange} 
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No agents found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </AdminLayout>
  );
};

export default AgentsPage;
