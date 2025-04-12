
import { Settings, Lock, CreditCard, Bell, UserCog, Globe } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SettingsNavProps {
  activeTab: string;
}

export const SettingsNav = ({ activeTab }: SettingsNavProps) => {
  return (
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
  );
};
