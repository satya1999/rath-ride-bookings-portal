
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
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { bookings, loading: bookingsLoading } = useBookings();
  
  const dashboardData = useDashboardData(bookings);
  
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
