
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TicketPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardStats from "@/components/dashboard/DashboardStats";
import OverviewTab from "@/components/dashboard/OverviewTab";
import BookingsTab from "@/components/dashboard/BookingsTab";
import CommissionsTab from "@/components/dashboard/CommissionsTab";
import WalletTab from "@/components/dashboard/WalletTab";
import { BookingHistoryItem } from "@/components/dashboard/BookingHistoryList";
import { CommissionHistoryItem } from "@/components/dashboard/CommissionHistory";
import { DashboardData } from "@/hooks/useDashboardData";
import { useToast } from "@/components/ui/use-toast";

interface DashboardContainerProps {
  dashboardData: DashboardData;
  bookings: BookingHistoryItem[];
  loading: boolean;
}

const DashboardContainer = ({ dashboardData, bookings, loading }: DashboardContainerProps) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleWithdraw = () => {
    toast({
      title: "Withdrawal Request Sent",
      description: "Your withdrawal request has been submitted and is pending approval."
    });
  };

  const navigateToBooking = () => {
    // Navigate to trips page with proper history entry
    navigate("/trips", { replace: false });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="mb-2">Agent Dashboard</h1>
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
        totalCommission={dashboardData.totalCommission}
        pendingCommission={dashboardData.pendingCommission}
        totalBookings={dashboardData.totalBookings}
        walletBalance={dashboardData.walletBalance}
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
          {loading ? (
            <div className="p-8 text-center">Loading dashboard data...</div>
          ) : (
            <OverviewTab 
              recentBookings={bookings.slice(0, 3)}
              commissionHistory={dashboardData.commissionHistory.slice(0, 3)}
              onTabChange={setActiveTab}
            />
          )}
        </TabsContent>
        
        <TabsContent value="bookings">
          {loading ? (
            <div className="p-8 text-center">Loading booking data...</div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center">No bookings found. Start by creating a new booking!</div>
          ) : (
            <BookingsTab bookings={bookings} />
          )}
        </TabsContent>
        
        <TabsContent value="commissions">
          <CommissionsTab commissions={dashboardData.commissionHistory} />
        </TabsContent>
        
        <TabsContent value="wallet">
          <WalletTab 
            walletBalance={dashboardData.walletBalance}
            pendingCommission={dashboardData.pendingCommission}
            onWithdraw={handleWithdraw}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default DashboardContainer;
