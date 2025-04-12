
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
import { TextField } from "./form-fields/TextField";
import { TextareaField } from "./form-fields/TextareaField";
import { SelectField } from "./form-fields/SelectField";

// Define schema for general settings
const generalSettingsSchema = z.object({
  appName: z.string().min(1, { message: "Application name is required" }),
  companyInfo: z.string(),
  supportEmail: z.string().email({ message: "Must be a valid email" }),
  currency: z.string(),
});

export type GeneralSettingsFormValues = z.infer<typeof generalSettingsSchema>;

const currencyOptions = [
  { value: "inr", label: "Indian Rupee (₹)" },
  { value: "usd", label: "US Dollar ($)" },
  { value: "eur", label: "Euro (€)" },
  { value: "gbp", label: "British Pound (£)" },
];

export const GeneralSettings = () => {
  const form = useForm<GeneralSettingsFormValues>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      appName: "Ananda Rath",
      companyInfo: "Ananda Rath Travels Pvt. Ltd.\n123 Main Street, New Delhi, India\n+91 98765 43210",
      supportEmail: "support@anandarath.com",
      currency: "inr",
    }
  });

  const handleSave = (values: GeneralSettingsFormValues) => {
    toast.success("General settings updated successfully");
    console.log(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Configure general settings for your application
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)}>
          <CardContent className="space-y-4">
            <TextField
              form={form}
              name="appName"
              label="Application Name"
              description="This is the name of your application that appears in the title bar and emails"
            />

            <TextareaField
              form={form}
              name="companyInfo"
              label="Company Information"
              description="This information will be displayed on invoices and receipts"
              rows={4}
            />

            <TextField
              form={form}
              name="supportEmail"
              label="Support Email"
              type="email"
            />

            <SelectField
              form={form}
              name="currency"
              label="Default Currency"
              options={currencyOptions}
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
