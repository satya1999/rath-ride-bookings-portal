
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TripHero from "@/components/trips/TripHero";
import TripDetailsTab from "@/components/trips/TripDetailsTab";
import TripItineraryTab from "@/components/trips/TripItineraryTab";
import TripPhotosTab from "@/components/trips/TripPhotosTab";
import TripSeatsTab from "@/components/trips/TripSeatsTab";
import { Trip, createTrip } from "@/types/trip";
import { bookingService } from "@/services/api";
import { toast } from "sonner";
import "@/styles/seat.css";

// For the MVP, we'll use mock data
// In a real application, this would come from an API
const mockTripData = {
  id: "550e8400-e29b-41d4-a716-446655440000", // Using a valid UUID format
  title: "Kedarnath & Badrinath Yatra",
  description: "Experience a spiritual journey to the sacred shrines of Kedarnath and Badrinath. Travel in our luxurious 1X2 AC Sleeper Bus with upper berths for a comfortable journey through the Himalayas.",
  from: "Bhubaneswar",
  to: "Kedarnath & Badrinath",
  date: new Date(2025, 4, 14),
  departureTime: "08:00 AM",
  arrivalTime: "11:00 AM",
  fare: 24500,
  availableSeats: 32,
  totalSeats: 36,
  busType: "Sleeper" as const,
  amenities: ["AC Sleeper Bus", "Pure Veg Meals", "Dharamshala Stay", "Experienced Guide", "Medical Support"],
  imageUrl: "https://source.unsplash.com/random/800x400/?kedarnath",
  itinerary: [
    { day: 1, title: "Departure from Bhubaneswar", description: "Board the comfortable AC Sleeper bus in the morning. Overnight journey." },
    { day: 2, title: "Arrival at Haridwar", description: "Morning arrival at Haridwar. Check-in at Dharamshala. Visit Har Ki Pauri for evening Ganga Aarti." },
    { day: 3, title: "Haridwar to Guptkashi", description: "After breakfast, depart for Guptkashi. Check-in at Dharamshala and rest." },
    { day: 4, title: "Guptkashi to Sonprayag", description: "Early morning departure to Sonprayag. Trek or take pony/palki to Kedarnath (at own expense)." },
    { day: 5, title: "Kedarnath Darshan", description: "Early morning darshan at Kedarnath Temple. Return to Sonprayag by evening." },
    { day: 6, title: "Sonprayag to Badrinath", description: "Morning departure for Badrinath. Evening arrival and rest at Dharamshala." },
    { day: 7, title: "Badrinath Darshan", description: "Early morning darshan at Badrinath Temple. Visit Mana Village - Last Indian Village." },
    { day: 8, title: "Badrinath to Joshimath", description: "After breakfast, depart for Joshimath. Visit Adi Shankaracharya Math." },
    { day: 9, title: "Joshimath to Rishikesh", description: "Morning departure for Rishikesh. Evening visit to Triveni Ghat for Ganga Aarti." },
    { day: 10, title: "Rishikesh Sightseeing", description: "Visit Laxman Jhula, Ram Jhula, and various ashrams in Rishikesh." },
    { day: 11, title: "Rishikesh to Mathura", description: "Departure for Mathura. Evening arrival and check-in at Dharamshala." },
    { day: 12, title: "Mathura and Vrindavan Darshan", description: "Visit Krishna Janmabhoomi and various temples in Mathura and Vrindavan." },
    { day: 13, title: "Return Journey Begins", description: "After breakfast, begin return journey to Bhubaneswar." },
    { day: 14, title: "Arrival at Bhubaneswar", description: "Morning arrival at Bhubaneswar. Tour concludes." }
  ],
  photos: [
    { title: "Kedarnath Temple", url: "https://source.unsplash.com/random/600x400/?kedarnath" },
    { title: "Badrinath Temple", url: "https://source.unsplash.com/random/600x400/?badrinath" },
    { title: "Haridwar Ganga Aarti", url: "https://source.unsplash.com/random/600x400/?haridwar" },
    { title: "Himalayan Mountains", url: "https://source.unsplash.com/random/600x400/?himalayas" },
    { title: "River Ganges", url: "https://source.unsplash.com/random/600x400/?ganges" },
    { title: "Rishikesh", url: "https://source.unsplash.com/random/600x400/?rishikesh" }
  ]
};

const TripDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [trip] = useState<Trip>(createTrip(mockTripData)); // Use our helper function
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("details");
  const [seatLayout, setSeatLayout] = useState({
    rows: 10,
    columns: 3,
    aisle: [1], // Column indices that represent the aisle
    unavailableSeats: ["L2", "L7", "R3", "R4", "R11", "R16", "SR2", "SR8", "SL3"], // Default unavailable seats
    sleeperBerths: 15, // 5 on left side, 10 on right side
    upperDeck: true
  });
  
  // Fetch booked seats for this trip
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        const bookedSeats = await bookingService.getTripBookedSeats(trip.id);
        if (bookedSeats && bookedSeats.length > 0) {
          setSeatLayout(prev => ({
            ...prev,
            unavailableSeats: [...prev.unavailableSeats, ...bookedSeats]
          }));
        }
      } catch (error) {
        console.error("Error fetching booked seats:", error);
        toast.error("Failed to load all booked seats");
      }
    };
    
    fetchBookedSeats();
  }, [trip.id]);

  return (
    <PageLayout>
      {trip && (
        <div className="space-y-8">
          {/* Trip Hero Section */}
          <TripHero 
            imageUrl={trip.imageUrl} 
            title={trip.title} 
            from={trip.from} 
            to={trip.to} 
          />
          
          {/* Trip Navigation Tabs */}
          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="seats">Select Seats</TabsTrigger>
            </TabsList>
            
            {/* Details Tab */}
            <TabsContent value="details">
              <TripDetailsTab 
                trip={trip} 
                selectedSeats={selectedSeats}
                onSelectSeatsClick={() => setActiveTab("seats")}
              />
            </TabsContent>
            
            {/* Itinerary Tab */}
            <TabsContent value="itinerary">
              <TripItineraryTab itinerary={trip.itinerary} />
            </TabsContent>
            
            {/* Photos Tab */}
            <TabsContent value="photos">
              <TripPhotosTab photos={trip.photos} />
            </TabsContent>
            
            {/* Seats Tab */}
            <TabsContent value="seats">
              <TripSeatsTab
                selectedSeats={selectedSeats}
                setSelectedSeats={setSelectedSeats}
                seatLayout={seatLayout}
                trip={trip}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </PageLayout>
  );
};

export default TripDetailPage;
