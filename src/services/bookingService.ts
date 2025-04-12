
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

export const bookingService = {
  getBookings: async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          trips:trip_id(name, source, destination),
          agents:agent_id(name, email)
        `)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
      return [];
    }
  },
  
  updateBookingStatus: async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status");
      return false;
    }
  },

  getTripBookedSeats: async (tripId: string) => {
    try {
      // Check if tripId is a valid UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(tripId)) {
        console.warn("Invalid UUID format for trip_id:", tripId);
        return []; // Return empty array if invalid UUID
      }
      
      const { data, error } = await supabase
        .from("bookings")
        .select("seats")
        .eq("trip_id", tripId)
        .in("status", ["confirmed", "pending"]);
        
      if (error) throw error;
      
      // Extract all booked seats
      let bookedSeats: string[] = [];
      if (data) {
        data.forEach(booking => {
          const seats = booking.seats as string[];
          bookedSeats = [...bookedSeats, ...seats];
        });
      }
      
      return bookedSeats;
    } catch (error) {
      console.error("Error fetching booked seats:", error);
      toast.error("Failed to fetch seat availability");
      return [];
    }
  },
  
  createBooking: async (bookingData: any) => {
    try {
      // Validate tripId is in UUID format
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(bookingData.trip_id)) {
        throw new Error("Invalid trip ID format");
      }
      
      // Convert passengers and seats to the proper Json type for Supabase
      const formattedData = {
        ...bookingData,
        passengers: bookingData.passengers as Json,
        seats: bookingData.seats as Json
      };
      
      const { data, error } = await supabase
        .from("bookings")
        .insert(formattedData)
        .select();
        
      if (error) throw error;
      
      return data[0] || null;
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking");
      return null;
    }
  }
};
