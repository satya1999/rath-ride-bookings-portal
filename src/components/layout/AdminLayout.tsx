
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Users,
  LayoutDashboard,
  Ticket,
  Settings,
  LogOut,
  UserCog,
  CreditCard,
  BusFront
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user, isLoading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  useEffect(() => {
    console.log("AdminLayout - Auth state:", { user: !!user, isAdmin, isLoading });
    // If still loading, do nothing
    if (isLoading) return;

    // If not authenticated at all
    if (!user) {
      console.log("AdminLayout - No user, redirecting to login");
      uiToast({
        title: "Authentication required",
        description: "Please login to access the admin panel.",
        variant: "destructive"
      });
      navigate("/admin-login");
      return;
    }

    // If authenticated but not an admin
    if (user && !isAdmin) {
      console.log("AdminLayout - User not admin, redirecting to dashboard");
      uiToast({
        title: "Access denied",
        description: "You don't have permission to access the admin panel.",
        variant: "destructive"
      });
      // Mark this as a regular session
      localStorage.removeItem("isAdminSession");
      navigate("/dashboard");
      return;
    }

    // If admin but not in admin session
    if (user && isAdmin && localStorage.getItem("isAdminSession") !== "true") {
      console.log("AdminLayout - Admin but not in admin session, setting flag");
      // This is an admin user accessing admin pages, ensure the flag is set
      localStorage.setItem("isAdminSession", "true");
    }
  }, [user, isLoading, isAdmin, navigate, uiToast]);

  const handleSignOut = async () => {
    localStorage.removeItem("isAdminSession");
    await signOut();
    toast("Signed out successfully");
    navigate("/admin-login");
  };

  // Show loading state while checking auth
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Don't render anything if not authenticated as admin
  if (!user || !isAdmin) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b border-border">
            <div className="flex items-center px-2 py-3">
              <div className="font-bold text-xl flex items-center gap-2">
                <span className="text-red-600">ADMIN</span>
                <span className="text-amber-500">PANEL</span>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Dashboard">
                      <a href="/admin">
                        <LayoutDashboard />
                        <span>Dashboard</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Users">
                      <a href="/admin/users">
                        <Users />
                        <span>Users</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Agents">
                      <a href="/admin/agents">
                        <UserCog />
                        <span>Agents</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Bookings">
                      <a href="/admin/bookings">
                        <Ticket />
                        <span>Bookings</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Commissions">
                      <a href="/admin/commissions">
                        <CreditCard />
                        <span>Commissions</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Bus Layouts">
                      <a href="/admin/bus-layouts">
                        <BusFront />
                        <span>Bus Layouts</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Trips">
                      <a href="/admin/trips">
                        <BusFront />
                        <span>Trips</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Settings">
                      <a href="/admin/settings">
                        <Settings />
                        <span>Settings</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className="border-t border-border p-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  {user.email?.[0].toUpperCase() || "A"}
                </div>
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
              <SidebarMenuButton 
                onClick={handleSignOut} 
                className="w-full justify-start text-destructive hover:text-destructive"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </SidebarMenuButton>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="flex items-center justify-between p-4 border-b bg-background">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold">Admin Panel</h1>
            </div>
            <div>
              {/* Additional header actions can go here */}
            </div>
          </div>
          
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
