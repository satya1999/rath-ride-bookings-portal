
import { supabase } from "@/integrations/supabase/client";
import { Trip, Itinerary, TripPhoto } from "@/types/trip";

export const tripService = {
  async createTrip(tripData: Partial<Trip>) {
    const { data: trip, error } = await supabase
      .from('trips')
      .insert({
        name: tripData.title,
        source: tripData.from,
        destination: tripData.to,
        departure_date: tripData.date,
        departure_time: tripData.departureTime,
        arrival_date: tripData.date,
        arrival_time: tripData.arrivalTime,
        base_price: tripData.fare,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return trip;
  },

  async updateTrip(id: string, tripData: Partial<Trip>) {
    const { data: trip, error } = await supabase
      .from('trips')
      .update({
        name: tripData.title,
        source: tripData.from,
        destination: tripData.to,
        departure_date: tripData.date,
        departure_time: tripData.departureTime,
        arrival_date: tripData.date,
        arrival_time: tripData.arrivalTime,
        base_price: tripData.fare,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return trip;
  },

  async deleteTrip(id: string) {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async uploadTripImage(tripId: string, file: File, title: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${tripId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('trip_images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('trip_images')
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from('trip_images')
      .insert({
        trip_id: tripId,
        url: publicUrl,
        title: title
      });

    if (dbError) throw dbError;

    return publicUrl;
  },

  async updateTripDetails(tripId: string, description: string, itinerary: Itinerary[], amenities: string[]) {
    const { error } = await supabase
      .from('trip_details')
      .upsert({
        trip_id: tripId,
        description,
        itinerary,
        amenities
      });

    if (error) throw error;
  }
};
