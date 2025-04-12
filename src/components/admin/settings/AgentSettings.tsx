
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { NumberField } from "./form-fields/NumberField";
import { SwitchField } from "./form-fields/SwitchField";

// Define schema for agent settings
const agentSettingsSchema = z.object({
  commissionRate: z.coerce.number().min(0).max(100),
  autoApproval: z.boolean(),
  approvalThreshold: z.coerce.number().min(0),
  selfRegistration: z.boolean(),
  minBookingReq: z.coerce.number().min(0),
});

export type AgentSettingsFormValues = z.infer<typeof agentSettingsSchema>;

export const AgentSettings = () => {
  const form = useForm<AgentSettingsFormValues>({
    resolver: zodResolver(agentSettingsSchema),
    defaultValues: {
      commissionRate: 10,
      autoApproval: true,
      approvalThreshold: 1000,
      selfRegistration: false,
      minBookingReq: 5,
    }
  });

  const handleSave = (values: AgentSettingsFormValues) => {
    toast.success("Agent settings updated successfully");
    console.log(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Settings</CardTitle>
        <CardDescription>
          Configure settings for travel agents
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)}>
          <CardContent className="space-y-4">
            <NumberField
              form={form}
              name="commissionRate"
              label="Default Commission Rate (%)"
              description="Default commission rate for new agents"
            />

            <SwitchField
              form={form}
              name="autoApproval"
              label="Automatic Commission Approval"
              description="Automatically approve commissions below threshold"
            />

            <NumberField
              form={form}
              name="approvalThreshold"
              label="Auto-Approval Threshold (₹)"
            />

            <SwitchField
              form={form}
              name="selfRegistration"
              label="Agent Self-Registration"
              description="Allow agents to register themselves via public form"
            />

            <NumberField
              form={form}
              name="minBookingReq"
              label="Minimum Booking Requirement"
              description="Minimum monthly bookings required to maintain active status"
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
