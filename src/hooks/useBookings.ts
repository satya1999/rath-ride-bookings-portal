
import { useState, useEffect } from "react";
import { bookingService } from "@/services/api";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Booking {
  id: string;
  booking_number: string;
  customer: string;
  agent: string;
  trip: string;
  date: string;
  amount: string;
  status: string;
}

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Get the current user
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      
      if (!userId) {
        console.warn("No user ID found, cannot fetch bookings");
        setLoading(false);
        return;
      }
      
      // Fetch bookings where the agent_id matches the current user's ID
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          booking_number,
          status,
          total_amount,
          created_at,
          passengers,
          trips:trip_id(name, source, destination)
        `)
        .eq('agent_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Format the data for display
      const formattedBookings = data.map(booking => {
        // Extract passenger info for the customer name
        const passengerData = booking.passengers as any[];
        const firstPassenger = passengerData && passengerData.length > 0 ? passengerData[0] : null;
        
        return {
          id: booking.id,
          booking_number: booking.booking_number,
          customer: firstPassenger?.name || "Unknown Customer",
          agent: "Current Agent", // We already know it's the current agent
          trip: `${booking.trips?.source || "Unknown"} to ${booking.trips?.destination || "Unknown"}`,
          date: new Date(booking.created_at).toLocaleDateString(),
          amount: `₹${booking.total_amount}`,
          status: booking.status
        };
      });
      
      setBookings(formattedBookings);
    } catch (error) {
      console.error("Error in useBookings:", error);
      toast.error("Failed to fetch bookings");
      setBookings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchBookings();
  }, []);
  
  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const result = await bookingService.updateBookingStatus(bookingId, newStatus);
      
      if (result) {
        // Update local state
        setBookings(
          bookings.map(booking => 
            booking.id === bookingId ? { ...booking, status: newStatus } : booking
          )
        );
        
        toast.success(`Booking status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status");
    }
  };
  
  return {
    bookings,
    loading,
    handleStatusChange,
    refetch: fetchBookings
  };
}
