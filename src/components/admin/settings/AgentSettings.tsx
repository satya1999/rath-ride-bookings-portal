
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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
            <FormField
              control={form.control}
              name="commissionRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default Commission Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Default commission rate for new agents
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="autoApproval"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div>
                    <FormLabel>Automatic Commission Approval</FormLabel>
                    <FormDescription>
                      Automatically approve commissions below threshold
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="approvalThreshold"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auto-Approval Threshold (₹)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="selfRegistration"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <div>
                    <FormLabel>Agent Self-Registration</FormLabel>
                    <FormDescription>
                      Allow agents to register themselves via public form
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minBookingReq"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Booking Requirement</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Minimum monthly bookings required to maintain active status
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
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
