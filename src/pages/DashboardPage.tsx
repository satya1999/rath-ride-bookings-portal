
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { TicketPlus } from "lucide-react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import OverviewTab from "@/components/dashboard/OverviewTab";
import BookingsTab from "@/components/dashboard/BookingsTab";
import CommissionsTab from "@/components/dashboard/CommissionsTab";
import WalletTab from "@/components/dashboard/WalletTab";
import { mockDashboardData } from "@/components/dashboard/DashboardData";
import { useAuth } from "@/contexts/AuthContext";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const DashboardPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Get tab from URL query parameter
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['overview', 'bookings', 'commissions', 'wallet'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);
  
  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please login to access the dashboard.",
        variant: "destructive"
      });
      navigate("/login");
    }
  }, [user, isLoading, navigate, toast]);

  // Don't render the dashboard if not authenticated or still loading
  if (isLoading || !user) {
    return null;
  }
  
  const handleWithdraw = () => {
    toast({
      title: "Withdrawal Request Sent",
      description: "Your withdrawal request has been submitted and is pending approval."
    });
  };

  const navigateToBooking = () => {
    navigate("/trips");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL with tab parameter
    navigate(`/dashboard?tab=${value}`, { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 md:ml-64">
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="mb-2 text-2xl font-bold">Agent Dashboard</h1>
              <p className="text-gray-600">Manage your bookings and commissions</p>
            </div>
            <Button 
              onClick={navigateToBooking}
              className="flex items-center gap-2"
            >
              <TicketPlus size={18} />
              Book a new ticket
            </Button>
          </div>
          
          {/* Dashboard Stats */}
          <DashboardStats 
            totalCommission={mockDashboardData.totalCommission}
            pendingCommission={mockDashboardData.pendingCommission}
            totalBookings={mockDashboardData.totalBookings}
            walletBalance={mockDashboardData.walletBalance}
          />
          
          {/* Dashboard Tabs */}
          <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange} className="mt-8">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="commissions">Commissions</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <OverviewTab 
                recentBookings={mockDashboardData.recentBookings}
                commissionHistory={mockDashboardData.commissionHistory}
                onTabChange={handleTabChange}
              />
            </TabsContent>
            
            <TabsContent value="bookings">
              <BookingsTab bookings={mockDashboardData.recentBookings} />
            </TabsContent>
            
            <TabsContent value="commissions">
              <CommissionsTab commissions={mockDashboardData.commissionHistory} />
            </TabsContent>
            
            <TabsContent value="wallet">
              <WalletTab 
                walletBalance={mockDashboardData.walletBalance}
                pendingCommission={mockDashboardData.pendingCommission}
                onWithdraw={handleWithdraw}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
