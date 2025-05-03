
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useBookings } from "@/hooks/useBookings";
import { useDashboardData } from "@/hooks/useDashboardData";
import DashboardContainer from "@/components/dashboard/DashboardContainer";

const DashboardPage = () => {
  const { toast } = useToast();
  const { user, isLoading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { bookings, loading: bookingsLoading } = useBookings();
  
  const dashboardData = useDashboardData(bookings);
  
  useEffect(() => {
    console.log("DashboardPage - Auth state:", { user: !!user, isAdmin, isLoading });
    
    // If still loading, do nothing
    if (isLoading) return;

    // If not authenticated at all
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to access the dashboard.",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    // If user is an admin and trying to access agent dashboard
    if (user && isAdmin && localStorage.getItem("isAdminSession") === "true") {
      toast({
        title: "Admin detected",
        description: "Redirecting to admin panel.",
      });
      navigate("/admin");
      return;
    }
  }, [user, isLoading, isAdmin, navigate, toast]);

  // Don't render the dashboard if not authenticated or still loading
  if (isLoading || !user) {
    return null;
  }
  
  // Format booking data for our components with proper type handling
  const formattedBookings = bookings.map(booking => {
    // Convert string status to the expected string literal type
    let typedStatus: "completed" | "pending" | "cancelled";
    
    if (booking.status === "completed") {
      typedStatus = "completed";
    } else if (booking.status === "cancelled") {
      typedStatus = "cancelled";
    } else {
      // Default to pending for any other status
      typedStatus = "pending";
    }
    
    return {
      id: booking.id,
      tripName: booking.trip,
      date: booking.date,
      passengers: 2, // This would need to come from real passenger data
      amount: parseInt(booking.amount.replace('₹', '').replace(',', ''), 10) || 0,
      commission: Math.round((parseInt(booking.amount.replace('₹', '').replace(',', ''), 10) || 0) * 0.1),
      status: typedStatus
    };
  });

  return (
    <PageLayout>
      <DashboardContainer 
        dashboardData={dashboardData} 
        bookings={formattedBookings}
        loading={bookingsLoading} 
      />
    </PageLayout>
  );
};

export default DashboardPage;
