
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useBookings";

const DashboardPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { bookings, loading: bookingsLoading } = useBookings();
  
  const [dashboardData, setDashboardData] = useState({
    totalCommission: 0,
    pendingCommission: 0,
    totalBookings: 0,
    walletBalance: 0,
    commissionHistory: []
  });
  
  useEffect(() => {
    // Calculate dashboard stats from real booking data
    if (bookings.length > 0) {
      // For this example, we'll create some simple calculations
      // In a real app, you might have more sophisticated logic or separate API calls
      
      const totalBookingsCount = bookings.length;
      
      // Assuming each booking has a commission of 10% of the amount
      const bookingsWithAmount = bookings.map(booking => {
        const amount = parseInt(booking.amount.replace('₹', '').replace(',', ''), 10) || 0;
        return {
          ...booking,
          numericAmount: amount,
          commission: Math.round(amount * 0.1) // 10% commission
        };
      });
      
      const totalCommission = bookingsWithAmount.reduce((sum, booking) => sum + booking.commission, 0);
      
      // Assuming pending commissions are from bookings with "pending" status
      const pendingCommission = bookingsWithAmount
        .filter(booking => booking.status === "pending")
        .reduce((sum, booking) => sum + booking.commission, 0);
        
      // Wallet balance is total commission minus pending
      const walletBalance = totalCommission - pendingCommission;
      
      // Format booking data for our components
      const formattedBookings = bookingsWithAmount.map(booking => ({
        id: booking.id,
        tripName: booking.trip,
        date: booking.date,
        passengers: 2, // This would need to come from real passenger data
        amount: booking.numericAmount,
        commission: booking.commission,
        status: booking.status === "completed" ? "completed" : 
               booking.status === "cancelled" ? "cancelled" : "pending"
      }));
      
      // Generate commission history from booking data
      // Group by month for simplicity
      const commissionsByMonth = {};
      bookingsWithAmount.forEach(booking => {
        const date = new Date(booking.date);
        const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
        
        if (!commissionsByMonth[monthYear]) {
          commissionsByMonth[monthYear] = {
            month: monthYear,
            amount: 0,
            bookings: 0,
            status: 'available'
          };
        }
        
        commissionsByMonth[monthYear].amount += booking.commission;
        commissionsByMonth[monthYear].bookings += 1;
      });
      
      const commissionHistory = Object.values(commissionsByMonth);
      
      setDashboardData({
        totalCommission,
        pendingCommission,
        totalBookings: totalBookingsCount,
        walletBalance,
        commissionHistory
      });
    }
  }, [bookings]);
  
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
    // Navigate to trips page with proper history entry
    navigate("/trips", { replace: false });
  };

  return (
    <PageLayout>
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
          {bookingsLoading ? (
            <div className="p-8 text-center">Loading dashboard data...</div>
          ) : (
            <OverviewTab 
              recentBookings={bookings.slice(0, 3).map(booking => ({
                id: booking.id,
                tripName: booking.trip,
                date: booking.date,
                passengers: 2, // This would need to come from real passenger data
                amount: parseInt(booking.amount.replace('₹', '').replace(',', ''), 10) || 0,
                commission: Math.round((parseInt(booking.amount.replace('₹', '').replace(',', ''), 10) || 0) * 0.1),
                status: booking.status === "completed" ? "completed" : 
                      booking.status === "cancelled" ? "cancelled" : "pending"
              }))}
              commissionHistory={dashboardData.commissionHistory.slice(0, 3)}
              onTabChange={setActiveTab}
            />
          )}
        </TabsContent>
        
        <TabsContent value="bookings">
          {bookingsLoading ? (
            <div className="p-8 text-center">Loading booking data...</div>
          ) : bookings.length === 0 ? (
            <div className="p-8 text-center">No bookings found. Start by creating a new booking!</div>
          ) : (
            <BookingsTab 
              bookings={bookings.map(booking => ({
                id: booking.id,
                tripName: booking.trip,
                date: booking.date,
                passengers: 2, // This would need to come from real passenger data
                amount: parseInt(booking.amount.replace('₹', '').replace(',', ''), 10) || 0,
                commission: Math.round((parseInt(booking.amount.replace('₹', '').replace(',', ''), 10) || 0) * 0.1),
                status: booking.status === "completed" ? "completed" : 
                      booking.status === "cancelled" ? "cancelled" : "pending"
              }))}
            />
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
    </PageLayout>
  );
};

export default DashboardPage;
