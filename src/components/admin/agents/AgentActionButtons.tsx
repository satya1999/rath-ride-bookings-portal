
import { useState } from "react";
import { 
  Edit, 
  Trash, 
  UserCheck, 
  UserX, 
  CreditCard, 
  Eye 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TextField } from "@/components/admin/settings/form-fields/TextField";
import { NumberField } from "@/components/admin/settings/form-fields/NumberField";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Agent {
  id: string;
  name: string;
  email: string;
  status: string;
}

interface AgentActionButtonsProps {
  agent: Agent;
  onStatusChange?: (agentId: string, newStatus: string) => void;
}

const editAgentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  commissionRate: z.coerce.number().min(0).max(100),
  phone: z.string().optional(),
});

export const AgentActionButtons = ({ agent, onStatusChange }: AgentActionButtonsProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const form = useForm<z.infer<typeof editAgentSchema>>({
    resolver: zodResolver(editAgentSchema),
    defaultValues: {
      name: agent.name,
      email: agent.email,
      commissionRate: 10,
      phone: "",
    }
  });

  const handleStatusChange = (newStatus: string) => {
    if (onStatusChange) {
      onStatusChange(agent.id, newStatus);
    } else {
      toast.success(`Agent ${agent.name} ${newStatus === "active" ? "activated" : "deactivated"}`);
    }
  };
  
  const handleViewAgent = () => {
    toast.info(`Viewing agent details for ${agent.name}`);
  };
  
  const handleCommissions = () => {
    toast.info(`Viewing commission details for ${agent.name}`);
  };
  
  const handleEditSubmit = (data: z.infer<typeof editAgentSchema>) => {
    toast.success(`Agent ${agent.name} updated successfully`);
    console.log("Updated agent data:", data);
    setIsEditOpen(false);
  };
  
  const handleDelete = () => {
    toast.success(`Agent ${agent.name} deleted successfully`);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button variant="ghost" size="icon" onClick={handleViewAgent}>
          <Eye className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleCommissions}>
          <CreditCard className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => setIsEditOpen(true)}>
          <Edit className="h-4 w-4" />
        </Button>
        {agent.status === "active" ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-amber-600"
            onClick={() => handleStatusChange("inactive")}
          >
            <UserX className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-green-600"
            onClick={() => handleStatusChange("active")}
          >
            <UserCheck className="h-4 w-4" />
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-destructive"
          onClick={() => setIsDeleteOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

      {/* Edit Agent Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Agent</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEditSubmit)} className="space-y-4">
              <TextField
                form={form}
                name="name"
                label="Name"
              />
              <TextField
                form={form}
                name="email"
                label="Email"
                type="email"
              />
              <TextField
                form={form}
                name="phone"
                label="Phone"
              />
              <NumberField
                form={form}
                name="commissionRate"
                label="Commission Rate (%)"
              />
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete agent {agent.name}?</p>
            <p className="text-sm text-muted-foreground mt-2">
              This action cannot be undone and will permanently remove the agent's data.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
