
import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Tabs, TabsContent } from "@/components/ui/tabs";

// Import settings components
import { GeneralSettings } from "@/components/admin/settings/GeneralSettings";
import { SecuritySettings } from "@/components/admin/settings/SecuritySettings";
import { AgentSettings } from "@/components/admin/settings/AgentSettings";
import { PlaceholderSettings } from "@/components/admin/settings/PlaceholderSettings";
import { SettingsNav } from "@/components/admin/settings/SettingsNav";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <SettingsNav activeTab={activeTab} />

        {/* General Settings */}
        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>

        {/* Agents Settings */}
        <TabsContent value="agents">
          <AgentSettings />
        </TabsContent>

        {/* Placeholder settings for other tabs */}
        <TabsContent value="billing">
          <PlaceholderSettings 
            title="Billing Settings" 
            description="Configure payment gateways and billing preferences"
          />
        </TabsContent>

        <TabsContent value="notifications">
          <PlaceholderSettings 
            title="Notification Settings" 
            description="Configure email and in-app notifications"
          />
        </TabsContent>

        <TabsContent value="system">
          <PlaceholderSettings 
            title="System Settings" 
            description="Configure system-wide settings and maintenance options"
          />
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default SettingsPage;
