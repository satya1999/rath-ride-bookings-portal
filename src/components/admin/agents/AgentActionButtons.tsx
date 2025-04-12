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
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TextField } from "@/components/admin/settings/form-fields/TextField";
import { NumberField } from "@/components/admin/settings/form-fields/NumberField";
import { Agent } from "@/hooks/useAgents";

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
  const [isProcessing, setIsProcessing] = useState(false);
  
  const form = useForm<z.infer<typeof editAgentSchema>>({
    resolver: zodResolver(editAgentSchema),
    defaultValues: {
      name: agent.name,
      email: agent.email,
      commissionRate: 10,
      phone: "",
    }
  });

  const handleStatusChange = async (newStatus: string) => {
    setIsProcessing(true);
    try {
      if (onStatusChange) {
        await onStatusChange(agent.id, newStatus);
      } else {
        toast.success(`Agent ${agent.name} ${newStatus === "active" ? "activated" : "deactivated"}`);
      }
    } catch (error) {
      console.error("Error changing status:", error);
      toast.error("Failed to change agent status");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleViewAgent = () => {
    toast.info(`Viewing agent details for ${agent.name}`);
  };
  
  const handleCommissions = () => {
    toast.info(`Viewing commission details for ${agent.name}`);
  };
  
  const handleEditSubmit = async (data: z.infer<typeof editAgentSchema>) => {
    setIsProcessing(true);
    try {
      // Implement API call to update agent
      toast.success(`Agent ${agent.name} updated successfully`);
      setIsEditOpen(false);
    } catch (error) {
      console.error("Error updating agent:", error);
      toast.error("Failed to update agent");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      // Implement API call to delete agent
      toast.success(`Agent ${agent.name} deleted successfully`);
      setIsDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting agent:", error);
      toast.error("Failed to delete agent");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleViewAgent}
          disabled={isProcessing}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleCommissions}
          disabled={isProcessing}
        >
          <CreditCard className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsEditOpen(true)}
          disabled={isProcessing}
        >
          <Edit className="h-4 w-4" />
        </Button>
        {agent.status === "active" ? (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-amber-600"
            onClick={() => handleStatusChange("inactive")}
            disabled={isProcessing}
          >
            <UserX className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-green-600"
            onClick={() => handleStatusChange("active")}
            disabled={isProcessing}
          >
            <UserCheck className="h-4 w-4" />
          </Button>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-destructive"
          onClick={() => setIsDeleteOpen(true)}
          disabled={isProcessing}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>

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
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? "Saving..." : "Save Changes"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isProcessing}
            >
              {isProcessing ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
