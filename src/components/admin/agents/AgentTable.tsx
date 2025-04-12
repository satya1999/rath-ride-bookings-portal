
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AgentActionButtons } from "@/components/admin/agents/AgentActionButtons";
import { Skeleton } from "@/components/ui/skeleton";

interface Agent {
  id: string;
  name: string;
  email: string;
  bookings: number;
  commissions: string;
  status: string;
  joined: string;
}

interface AgentTableProps {
  agents: Agent[];
  onStatusChange: (agentId: string, newStatus: string) => void;
  loading?: boolean;
}

export const AgentTable = ({ agents, onStatusChange, loading = false }: AgentTableProps) => {
  if (loading) {
    return (
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
          {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
              <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[70px]" /></TableCell>
              <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
              <TableCell className="text-right"><Skeleton className="h-4 w-[100px] ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }

  return (
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
        {agents.length > 0 ? (
          agents.map((agent) => (
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
              <TableCell>{new Date(agent.joined || agent.joined_at).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <AgentActionButtons 
                  agent={agent} 
                  onStatusChange={onStatusChange} 
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
  );
};
