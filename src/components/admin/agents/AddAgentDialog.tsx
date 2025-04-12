
import { useState } from "react";
import { UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { TextField } from "@/components/admin/settings/form-fields/TextField";
import { NumberField } from "@/components/admin/settings/form-fields/NumberField";

// Form schema
const addAgentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  commission: z.coerce.number().min(0).max(100),
});

export type AddAgentFormValues = z.infer<typeof addAgentSchema>;

interface AddAgentDialogProps {
  onAddAgent: (data: AddAgentFormValues) => void;
}

export const AddAgentDialog = ({ onAddAgent }: AddAgentDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const form = useForm<AddAgentFormValues>({
    resolver: zodResolver(addAgentSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      commission: 10,
    }
  });

  const handleSubmit = (data: AddAgentFormValues) => {
    onAddAgent(data);
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
              name="password"
              label="Password"
              type="password"
            />
            <NumberField
              form={form}
              name="commission"
              label="Commission Rate (%)"
            />
            <Button type="submit" className="w-full">Create Agent</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
