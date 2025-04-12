
import { format } from "date-fns";

export interface Itinerary {
  day: number;
  title: string;
  description: string;
}

export interface TripPhoto {
  title: string;
  url: string;
}

export interface Passenger {
  name: string;
  mobile: string;
  age: number;
  bloodGroup?: string;
  aadharFront?: File;
  aadharBack?: File;
  seatNumber: string;
  advanceAmount?: number; // Added field for advance payment amount
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  from: string;
  to: string;
  date: Date;
  formattedDate: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  availableSeats: number;
  totalSeats: number;
  busType: "Seater" | "Sleeper" | "Mixed";
  amenities: string[];
  imageUrl: string;
  itinerary: Itinerary[];
  photos: TripPhoto[];
}

// Helper function to create Trip object with formatted date
export function createTrip(tripData: Omit<Trip, "formattedDate">): Trip {
  return {
    ...tripData,
    formattedDate: format(tripData.date, "dd MMMM yyyy"),
  };
}
