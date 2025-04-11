
import { useState } from "react";
import TripCard, { TripCardProps } from "./TripCard";

// Sample data - in a real app, this would come from an API
const mockTrips: TripCardProps[] = [
  {
    id: "1",
    title: "Kedarnath & Badrinath Yatra",
    from: "Bhubaneswar",
    to: "Kedarnath & Badrinath",
    date: new Date(2025, 4, 14), // May 14, 2025
    departureTime: "08:00 AM",
    fare: 24500,
    availableSeats: 28,
    totalSeats: 36,
    busType: "Sleeper",
    imageUrl: "https://source.unsplash.com/random/300x200/?kedarnath",
    description: "14 Days / 13 Nights | Pure veg Lunch and Dinner daily | Dharamshala Stay",
  },
  {
    id: "2",
    title: "Vrindavan, Mathura & Ayodhya Darshan",
    from: "Balasore",
    to: "Vrindavan, Mathura & Ayodhya",
    date: new Date(2025, 4, 20), // May 20, 2025
    departureTime: "07:00 AM",
    fare: 18500,
    availableSeats: 24,
    totalSeats: 36,
    busType: "Sleeper",
    imageUrl: "https://source.unsplash.com/random/300x200/?mathura",
    description: "8 Days / 7 Nights | Satvik Lunch and Dinner included | Dharamshala Stay",
  },
  {
    id: "3",
    title: "Kashi, Prayagraj & Chitrakoot Pilgrimage",
    from: "Cuttack",
    to: "Kashi, Prayagraj & Chitrakoot",
    date: new Date(2025, 4, 18), // May 18, 2025
    departureTime: "06:30 AM",
    fare: 16900,
    availableSeats: 32,
    totalSeats: 36,
    busType: "Sleeper",
    imageUrl: "https://source.unsplash.com/random/300x200/?kashi",
    description: "7 Days / 6 Nights | Daily hot Lunch & Dinner provided | Dharamshala Stay",
  },
  {
    id: "4",
    title: "Nepal – Pashupatinath & Mankamna Devi Yatra",
    from: "Bhubaneswar",
    to: "Nepal - Pashupatinath & Mankamna",
    date: new Date(2025, 4, 28), // May 28, 2025
    departureTime: "07:30 AM",
    fare: 22500,
    availableSeats: 26,
    totalSeats: 36,
    busType: "Sleeper",
    imageUrl: "https://source.unsplash.com/random/300x200/?pashupatinath",
    description: "12 Days / 11 Nights | Delicious home-style Lunch & Dinner | Dharamshala Stay",
  },
  {
    id: "5",
    title: "Agra, Mathura, Vrindavan & Tajmahal Tour",
    from: "Sambalpur",
    to: "Agra, Mathura & Vrindavan",
    date: new Date(2025, 4, 22), // May 22, 2025
    departureTime: "06:00 AM",
    fare: 19500,
    availableSeats: 30,
    totalSeats: 36,
    busType: "Sleeper",
    imageUrl: "https://source.unsplash.com/random/300x200/?tajmahal",
    description: "10 Days / 9 Nights | Full Veg Lunch & Dinner daily | Dharamshala Stay",
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
