
import { useState, useEffect } from "react";
import { tripService } from "@/services";
import { Trip, Itinerary } from "@/types/trip";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchTrips = async () => {
    setLoading(true);
    try {
      const { data: tripsData, error } = await supabase
        .from('trips')
        .select(`
          *,
          trip_details (*),
          trip_images (*)
        `);
      
      if (error) throw error;
      
      const formattedTrips: Trip[] = tripsData.map((trip) => {
        // Ensure amenities is always a string array
        const amenities = trip.trip_details?.amenities || [];
        let formattedAmenities: string[] = [];
        
        if (Array.isArray(amenities)) {
          formattedAmenities = amenities.map(item => String(item));
        }
        
        // Ensure itinerary is properly formatted
        const itinerary = trip.trip_details?.itinerary || [];
        let formattedItinerary: Itinerary[] = [];
        
        if (Array.isArray(itinerary)) {
          formattedItinerary = itinerary.map((item: any) => ({
            day: typeof item.day === 'number' ? item.day : 1,
            title: String(item.title || ''),
            description: String(item.description || '')
          }));
        }
        
        return {
          id: trip.id,
          title: trip.name,
          from: trip.source,
          to: trip.destination,
          date: new Date(trip.departure_date),
          departureTime: trip.departure_time,
          arrivalTime: trip.arrival_time,
          fare: trip.base_price,
          availableSeats: 36, // This would need to come from real seat data
          totalSeats: 36,
          busType: "Sleeper" as "Sleeper" | "Seater" | "Mixed",
          description: trip.trip_details?.description || "",
          amenities: formattedAmenities,
          itinerary: formattedItinerary,
          photos: trip.trip_images || [],
          imageUrl: trip.trip_images?.[0]?.url,
          formattedDate: "" // This will be populated by the createTrip function
        };
      });
      
      setTrips(formattedTrips);
    } catch (error) {
      console.error("Error in useTrips:", error);
      toast.error("Failed to fetch trips");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTrips();
  }, []);

  const handleAddTrip = async (tripData: Partial<Trip>) => {
    try {
      const trip = await tripService.createTrip(tripData);
      toast.success("Trip created successfully");
      await fetchTrips();
      return trip;
    } catch (error) {
      console.error("Error adding trip:", error);
      toast.error("Failed to create trip");
      throw error;
    }
  };

  const handleUpdateTrip = async (id: string, tripData: Partial<Trip>) => {
    try {
      await tripService.updateTrip(id, tripData);
      toast.success("Trip updated successfully");
      await fetchTrips();
    } catch (error) {
      console.error("Error updating trip:", error);
      toast.error("Failed to update trip");
      throw error;
    }
  };

  const handleDeleteTrip = async (id: string) => {
    try {
      await tripService.deleteTrip(id);
      toast.success("Trip deleted successfully");
      await fetchTrips();
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip");
      throw error;
    }
  };

  const handleUploadImage = async (tripId: string, file: File, title: string) => {
    try {
      await tripService.uploadTripImage(tripId, file, title);
      toast.success("Image uploaded successfully");
      await fetchTrips();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      throw error;
    }
  };

  const handleUpdateDetails = async (
    tripId: string, 
    description: string, 
    itinerary: Itinerary[], 
    amenities: string[]
  ) => {
    try {
      await tripService.updateTripDetails(tripId, description, itinerary, amenities);
      toast.success("Trip details updated successfully");
      await fetchTrips();
    } catch (error) {
      console.error("Error updating trip details:", error);
      toast.error("Failed to update trip details");
      throw error;
    }
  };

  return {
    trips,
    loading,
    addTrip: handleAddTrip,
    updateTrip: handleUpdateTrip,
    deleteTrip: handleDeleteTrip,
    uploadImage: handleUploadImage,
    updateDetails: handleUpdateDetails,
    refetch: fetchTrips
  };
}
