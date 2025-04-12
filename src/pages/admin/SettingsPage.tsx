
import { useState } from "react";
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

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = () => {
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <FormLabel>Application Name</FormLabel>
                <Input defaultValue="Ananda Rath" />
                <FormDescription>
                  This is the name of your application that appears in the title bar and emails
                </FormDescription>
              </div>

              <div className="space-y-2">
                <FormLabel>Company Information</FormLabel>
                <Textarea 
                  defaultValue="Ananda Rath Travels Pvt. Ltd.&#10;123 Main Street, New Delhi, India&#10;+91 98765 43210" 
                  rows={4} 
                />
                <FormDescription>
                  This information will be displayed on invoices and receipts
                </FormDescription>
              </div>

              <div className="space-y-2">
                <FormLabel>Support Email</FormLabel>
                <Input defaultValue="support@anandarath.com" type="email" />
              </div>

              <div className="space-y-2">
                <FormLabel>Default Currency</FormLabel>
                <Select defaultValue="inr">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                    <SelectItem value="usd">US Dollar ($)</SelectItem>
                    <SelectItem value="eur">Euro (€)</SelectItem>
                    <SelectItem value="gbp">British Pound (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
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
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <FormLabel className="block">Two-Factor Authentication</FormLabel>
                  <FormDescription>
                    Enable two-factor authentication for all admin accounts
                  </FormDescription>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <FormLabel className="block">Password Expiry</FormLabel>
                  <FormDescription>
                    Force password change every 90 days
                  </FormDescription>
                </div>
                <Switch />
              </div>

              <div className="space-y-2">
                <FormLabel>Session Timeout (minutes)</FormLabel>
                <Input type="number" defaultValue="30" />
                <FormDescription>
                  Automatically logout inactive users after this period
                </FormDescription>
              </div>

              <div className="space-y-2">
                <FormLabel>Login Attempts Before Lockout</FormLabel>
                <Input type="number" defaultValue="5" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
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
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <FormLabel>Default Commission Rate (%)</FormLabel>
                <Input type="number" defaultValue="10" />
                <FormDescription>
                  Default commission rate for new agents
                </FormDescription>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <FormLabel className="block">Automatic Commission Approval</FormLabel>
                  <FormDescription>
                    Automatically approve commissions below threshold
                  </FormDescription>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <FormLabel>Auto-Approval Threshold (₹)</FormLabel>
                <Input type="number" defaultValue="1000" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <FormLabel className="block">Agent Self-Registration</FormLabel>
                  <FormDescription>
                    Allow agents to register themselves via public form
                  </FormDescription>
                </div>
                <Switch />
              </div>

              <div className="space-y-2">
                <FormLabel>Minimum Booking Requirement</FormLabel>
                <Input type="number" defaultValue="5" />
                <FormDescription>
                  Minimum monthly bookings required to maintain active status
                </FormDescription>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
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
              <Button onClick={handleSave}>Save Changes</Button>
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
              <Button onClick={handleSave}>Save Changes</Button>
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
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default SettingsPage;
