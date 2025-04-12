
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
import { SwitchField } from "./form-fields/SwitchField";
import { NumberField } from "./form-fields/NumberField";

// Define schema for security settings
const securitySettingsSchema = z.object({
  twoFactor: z.boolean(),
  passwordExpiry: z.boolean(),
  sessionTimeout: z.coerce.number().min(1),
  loginAttempts: z.coerce.number().min(1),
});

export type SecuritySettingsFormValues = z.infer<typeof securitySettingsSchema>;

export const SecuritySettings = () => {
  const form = useForm<SecuritySettingsFormValues>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      twoFactor: true,
      passwordExpiry: false,
      sessionTimeout: 30,
      loginAttempts: 5,
    }
  });

  const handleSave = (values: SecuritySettingsFormValues) => {
    toast.success("Security settings updated successfully");
    console.log(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Settings</CardTitle>
        <CardDescription>
          Configure security settings for your application
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)}>
          <CardContent className="space-y-4">
            <SwitchField
              form={form}
              name="twoFactor"
              label="Two-Factor Authentication"
              description="Enable two-factor authentication for all admin accounts"
            />

            <SwitchField
              form={form}
              name="passwordExpiry"
              label="Password Expiry"
              description="Force password change every 90 days"
            />

            <NumberField
              form={form}
              name="sessionTimeout"
              label="Session Timeout (minutes)"
              description="Automatically logout inactive users after this period"
            />

            <NumberField
              form={form}
              name="loginAttempts"
              label="Login Attempts Before Lockout"
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
