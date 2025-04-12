
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Eye, 
  MoreHorizontal, 
  Search, 
  UserCog,
  Edit,
  Trash,
  UserCheck,
  UserX,
  CreditCard
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

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
  
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Agents Management</h1>
        <Dialog>
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
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name">Name</label>
                <Input id="name" placeholder="Full name" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="email">Email</label>
                <Input id="email" type="email" placeholder="Email address" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="password">Password</label>
                <Input id="password" type="password" placeholder="Password" />
              </div>
              <div className="grid gap-2">
                <label htmlFor="commission">Commission Rate (%)</label>
                <Input id="commission" type="number" placeholder="5" />
              </div>
            </div>
            <Button className="w-full">Create Agent</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="outline">All</Button>
            <Button variant="outline">Active</Button>
            <Button variant="outline">Inactive</Button>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Commissions</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        {agent.status === "active" ? (
                          <DropdownMenuItem className="text-amber-600">
                            <UserX className="mr-2 h-4 w-4" />
                            <span>Deactivate</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <UserCheck className="mr-2 h-4 w-4" />
                            <span>Activate</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-destructive">
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
