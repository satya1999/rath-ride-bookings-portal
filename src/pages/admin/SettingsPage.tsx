
import { useState } from "react";
import { useForm } from "react-hook-form";
import AdminLayout from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { toast } from "sonner";
import { Settings, Lock, CreditCard, Bell, UserCog, Globe } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define schemas for each settings tab
const generalSettingsSchema = z.object({
  appName: z.string().min(1, { message: "Application name is required" }),
  companyInfo: z.string(),
  supportEmail: z.string().email({ message: "Must be a valid email" }),
  currency: z.string(),
});

const securitySettingsSchema = z.object({
  twoFactor: z.boolean(),
  passwordExpiry: z.boolean(),
  sessionTimeout: z.coerce.number().min(1),
  loginAttempts: z.coerce.number().min(1),
});

const agentSettingsSchema = z.object({
  commissionRate: z.coerce.number().min(0).max(100),
  autoApproval: z.boolean(),
  approvalThreshold: z.coerce.number().min(0),
  selfRegistration: z.boolean(),
  minBookingReq: z.coerce.number().min(0),
});

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  // Initialize forms for each tab
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: {
      appName: "Ananda Rath",
      companyInfo: "Ananda Rath Travels Pvt. Ltd.\n123 Main Street, New Delhi, India\n+91 98765 43210",
      supportEmail: "support@anandarath.com",
      currency: "inr",
    }
  });

  const securityForm = useForm<z.infer<typeof securitySettingsSchema>>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      twoFactor: true,
      passwordExpiry: false,
      sessionTimeout: 30,
      loginAttempts: 5,
    }
  });

  const agentForm = useForm<z.infer<typeof agentSettingsSchema>>({
    resolver: zodResolver(agentSettingsSchema),
    defaultValues: {
      commissionRate: 10,
      autoApproval: true,
      approvalThreshold: 1000,
      selfRegistration: false,
      minBookingReq: 5,
    }
  });

  const handleSaveGeneral = (values: z.infer<typeof generalSettingsSchema>) => {
    toast.success("General settings updated successfully");
    console.log(values);
  };

  const handleSaveSecurity = (values: z.infer<typeof securitySettingsSchema>) => {
    toast.success("Security settings updated successfully");
    console.log(values);
  };

  const handleSaveAgent = (values: z.infer<typeof agentSettingsSchema>) => {
    toast.success("Agent settings updated successfully");
    console.log(values);
  };

  const handleSaveOther = () => {
    toast.success("Settings updated successfully");
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 gap-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span>Billing</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="agents" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            <span>Agents</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>System</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure general settings for your application
              </CardDescription>
            </CardHeader>
            <Form {...generalForm}>
              <form onSubmit={generalForm.handleSubmit(handleSaveGeneral)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={generalForm.control}
                    name="appName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the name of your application that appears in the title bar and emails
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="companyInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Information</FormLabel>
                        <FormControl>
                          <Textarea rows={4} {...field} />
                        </FormControl>
                        <FormDescription>
                          This information will be displayed on invoices and receipts
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="supportEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Support Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={generalForm.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Default Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                            <SelectItem value="usd">US Dollar ($)</SelectItem>
                            <SelectItem value="eur">Euro (€)</SelectItem>
                            <SelectItem value="gbp">British Pound (£)</SelectItem>
                          </SelectContent>
                        </Select>
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
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure security settings for your application
              </CardDescription>
            </CardHeader>
            <Form {...securityForm}>
              <form onSubmit={securityForm.handleSubmit(handleSaveSecurity)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={securityForm.control}
                    name="twoFactor"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Two-Factor Authentication</FormLabel>
                          <FormDescription>
                            Enable two-factor authentication for all admin accounts
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
                    control={securityForm.control}
                    name="passwordExpiry"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between">
                        <div>
                          <FormLabel>Password Expiry</FormLabel>
                          <FormDescription>
                            Force password change every 90 days
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
                    control={securityForm.control}
                    name="sessionTimeout"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Session Timeout (minutes)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormDescription>
                          Automatically logout inactive users after this period
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={securityForm.control}
                    name="loginAttempts"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login Attempts Before Lockout</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
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
        </TabsContent>

        {/* Agents Settings */}
        <TabsContent value="agents">
          <Card>
            <CardHeader>
              <CardTitle>Agent Settings</CardTitle>
              <CardDescription>
                Configure settings for travel agents
              </CardDescription>
            </CardHeader>
            <Form {...agentForm}>
              <form onSubmit={agentForm.handleSubmit(handleSaveAgent)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={agentForm.control}
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
                    control={agentForm.control}
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
                    control={agentForm.control}
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
                    control={agentForm.control}
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
                    control={agentForm.control}
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
        </TabsContent>

        {/* Placeholder for other tabs */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
              <CardDescription>
                Configure payment gateways and billing preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Configure your billing settings here.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveOther}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email and in-app notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Configure your notification settings here.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveOther}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and maintenance options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Configure your system settings here.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveOther}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default SettingsPage;
