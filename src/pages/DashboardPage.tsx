
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import DashboardStats from "@/components/dashboard/DashboardStats";
import OverviewTab from "@/components/dashboard/OverviewTab";
import BookingsTab from "@/components/dashboard/BookingsTab";
import CommissionsTab from "@/components/dashboard/CommissionsTab";
import WalletTab from "@/components/dashboard/WalletTab";
import { mockDashboardData } from "@/components/dashboard/DashboardData";
import { useAuth } from "@/contexts/AuthContext";

const DashboardPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
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

  return (
    <PageLayout>
      <h1 className="mb-2">Agent Dashboard</h1>
      <p className="text-gray-600 mb-6">Manage your bookings and commissions</p>
      
      {/* Dashboard Stats */}
      <DashboardStats 
        totalCommission={mockDashboardData.totalCommission}
        pendingCommission={mockDashboardData.pendingCommission}
        totalBookings={mockDashboardData.totalBookings}
        walletBalance={mockDashboardData.walletBalance}
      />
      
      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
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
            onTabChange={setActiveTab}
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
    </PageLayout>
  );
};

export default DashboardPage;
