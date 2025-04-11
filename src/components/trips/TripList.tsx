
import { useState } from "react";
import TripCard, { TripCardProps } from "./TripCard";

// Sample data - in a real app, this would come from an API
const mockTrips: TripCardProps[] = [
  {
    id: "1",
    title: "Deluxe Trip to Puri",
    from: "Bhubaneswar",
    to: "Puri",
    date: new Date(2025, 3, 15),
    departureTime: "08:00 AM",
    fare: 2500,
    availableSeats: 32,
    totalSeats: 36,
    busType: "Seater",
  },
  {
    id: "2",
    title: "Premium Konark Tour",
    from: "Bhubaneswar",
    to: "Konark",
    date: new Date(2025, 3, 16),
    departureTime: "09:30 AM",
    fare: 3000,
    availableSeats: 18,
    totalSeats: 24,
    busType: "Mixed",
  },
  {
    id: "3",
    title: "Royal Chilika Lake Trip",
    from: "Bhubaneswar",
    to: "Chilika",
    date: new Date(2025, 3, 17),
    departureTime: "07:00 AM",
    fare: 3500,
    availableSeats: 12,
    totalSeats: 18,
    busType: "Sleeper",
  },
  {
    id: "4",
    title: "Explore Bhitarkanika",
    from: "Bhubaneswar",
    to: "Bhitarkanika",
    date: new Date(2025, 3, 18),
    departureTime: "06:30 AM",
    fare: 4000,
    availableSeats: 24,
    totalSeats: 36,
    busType: "Mixed",
  },
  {
    id: "5",
    title: "Scenic Daringbadi Tour",
    from: "Bhubaneswar",
    to: "Daringbadi",
    date: new Date(2025, 3, 20),
    departureTime: "10:00 PM",
    fare: 3200,
    availableSeats: 28,
    totalSeats: 36,
    busType: "Sleeper",
  },
  {
    id: "6",
    title: "Majestic Simlipal Trip",
    from: "Bhubaneswar",
    to: "Simlipal",
    date: new Date(2025, 3, 22),
    departureTime: "09:00 AM",
    fare: 3800,
    availableSeats: 16,
    totalSeats: 24,
    busType: "Seater",
  },
];

const TripList = () => {
  const [trips] = useState<TripCardProps[]>(mockTrips);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <TripCard key={trip.id} {...trip} />
        ))}
      </div>
      
      {trips.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No trips found</h3>
          <p className="text-gray-500">
            Check back later for new trips.
          </p>
        </div>
      )}
    </div>
  );
};

export default TripList;
