
import { useState, useEffect } from "react";
import { bookingService } from "@/services/api";
import { toast } from "sonner";

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
      const data = await bookingService.getBookings();
      
      // Format the data for display
      const formattedBookings = data.map(booking => {
        // Extract passenger info for the customer name
        const passengerData = booking.passengers as any[];
        const firstPassenger = passengerData && passengerData.length > 0 ? passengerData[0] : null;
        
        return {
          id: booking.id,
          booking_number: booking.booking_number,
          customer: firstPassenger?.name || "Unknown Customer",
          agent: booking.agents?.name || "Direct Booking", 
          trip: `${booking.trips.source} to ${booking.trips.destination}`,
          date: new Date(booking.created_at).toISOString().split('T')[0],
          amount: `₹${booking.total_amount}`,
          status: booking.status
        };
      });
      
      setBookings(formattedBookings);
    } catch (error) {
      console.error("Error in useBookings:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchBookings();
  }, []);
  
  const handleStatusChange = async (bookingId: string, newStatus: string) => {
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
  };
  
  return {
    bookings,
    loading,
    handleStatusChange,
    refetch: fetchBookings
  };
}
