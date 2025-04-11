
import { useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, IndianRupee, User, Users, FileText, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// For the MVP, we'll use mock data
// In a real application, this would come from an API
const mockTrip = {
  id: "1",
  title: "Kedarnath & Badrinath Yatra",
  description: "Experience a spiritual journey to the sacred shrines of Kedarnath and Badrinath. Travel in our luxurious 2X1 AC Sleeper Bus for a comfortable journey through the Himalayas.",
  from: "Bhubaneswar",
  to: "Kedarnath & Badrinath",
  date: new Date(2025, 4, 14),
  departureTime: "08:00 AM",
  arrivalTime: "11:00 AM",
  fare: 24500,
  availableSeats: 32,
  totalSeats: 36,
  busType: "Sleeper",
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

// Seat layout data - normally this would come from the backend
const seatLayout = {
  rows: 9,
  columns: 4,
  aisle: [2], // Column indices that represent the aisle
  unavailableSeats: ["1A", "3C", "5D", "7B", "9A"] // Already booked seats
};

const TripDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [trip] = useState(mockTrip);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("details");
  
  // Generate seat layout
  const seats = [];
  const rowLabels = ["A", "B", "C", "D"];
  
  for (let row = 1; row <= seatLayout.rows; row++) {
    const rowSeats = [];
    for (let col = 0; col < seatLayout.columns; col++) {
      const seatId = `${row}${rowLabels[col]}`;
      const isAisle = seatLayout.aisle.includes(col);
      const isBooked = seatLayout.unavailableSeats.includes(seatId);
      const isSelected = selectedSeats.includes(seatId);
      
      if (!isAisle) {
        rowSeats.push({
          id: seatId,
          booked: isBooked,
          selected: isSelected
        });
      } else {
        rowSeats.push(null); // Aisle
      }
    }
    seats.push(rowSeats);
  }
  
  const handleSeatClick = (seatId: string, isBooked: boolean) => {
    if (isBooked) return;
    
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };
  
  const totalAmount = selectedSeats.length * 2000; // ₹2000 per seat
  
  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to proceed.",
        variant: "destructive",
      });
      return;
    }
    
    // Here we would navigate to the passenger info form
    toast({
      title: "Seats selected!",
      description: `You've selected ${selectedSeats.length} seats. Total: ₹${totalAmount}`,
    });
    
    // In a real app, this would navigate to a passenger info page
    // navigate(`/trips/${id}/book`, { state: { selectedSeats } });
  };

  return (
    <PageLayout>
      {trip && (
        <div className="space-y-8">
          {/* Trip Hero */}
          <div className="relative h-72 rounded-lg overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${trip.imageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="font-bold text-3xl">{trip.title}</h1>
              <div className="flex items-center mt-2">
                <MapPin className="h-5 w-5 mr-1" />
                <span className="text-lg">
                  {trip.from} to {trip.to}
                </span>
              </div>
            </div>
          </div>
          
          {/* Trip Navigation Tabs */}
          <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="seats">Select Seats</TabsTrigger>
            </TabsList>
            
            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Card className="md:col-span-2">
                  <CardContent className="pt-6">
                    <h2 className="text-2xl font-bold mb-4">Trip Details</h2>
                    <p className="text-gray-600 mb-6">{trip.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-rath-red mt-0.5" />
                        <div>
                          <p className="font-medium">Date</p>
                          <p className="text-gray-600">{format(trip.date, "dd MMMM yyyy")}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-rath-red mt-0.5" />
                        <div>
                          <p className="font-medium">Departure Time</p>
                          <p className="text-gray-600">{trip.departureTime}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <IndianRupee className="h-5 w-5 text-rath-red mt-0.5" />
                        <div>
                          <p className="font-medium">Fare</p>
                          <p className="text-gray-600">₹{trip.fare} per seat</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Users className="h-5 w-5 text-rath-red mt-0.5" />
                        <div>
                          <p className="font-medium">Available Seats</p>
                          <p className="text-gray-600">{trip.availableSeats} of {trip.totalSeats}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="font-semibold mb-2">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {trip.amenities.map((amenity, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-bold mb-4">Booking Summary</h2>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Selected Seats:</span>
                        <span className="font-medium">
                          {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Advance Payment:</span>
                        <span className="font-medium">₹{totalAmount.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Balance Due:</span>
                        <span className="font-medium">₹{(selectedSeats.length * (trip.fare - 2000)).toLocaleString()}</span>
                      </div>
                      
                      <hr />
                      
                      <div className="flex justify-between font-bold">
                        <span>Total Fare:</span>
                        <span>₹{(selectedSeats.length * trip.fare).toLocaleString()}</span>
                      </div>
                      
                      <div className="pt-2">
                        <Button 
                          className="w-full" 
                          onClick={() => setActiveTab("seats")}
                        >
                          Select Seats
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Itinerary Tab */}
            <TabsContent value="itinerary">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-6">
                    <FileText className="h-6 w-6 text-rath-red mr-2" />
                    <h2 className="text-2xl font-bold">Day by Day Itinerary</h2>
                  </div>
                  
                  <div className="space-y-6">
                    {trip.itinerary.map((day, index) => (
                      <div key={index} className="relative pl-8 before:absolute before:left-3 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-200">
                        <div className="absolute left-0 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-rath-red text-white text-sm font-bold">
                          {day.day}
                        </div>
                        <div className="border-l-4 border-rath-red pl-4 py-2">
                          <h3 className="font-bold text-lg">{day.title}</h3>
                          <p className="text-gray-600 mt-1">{day.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Photos Tab */}
            <TabsContent value="photos">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-6">
                    <Image className="h-6 w-6 text-rath-red mr-2" />
                    <h2 className="text-2xl font-bold">Trip Photos</h2>
                  </div>
                  
                  <div className="mb-8">
                    <Carousel className="w-full max-w-4xl mx-auto">
                      <CarouselContent>
                        {trip.photos.map((photo, index) => (
                          <CarouselItem key={index}>
                            <div className="p-1">
                              <Card>
                                <CardContent className="p-0">
                                  <AspectRatio ratio={16/9}>
                                    <img
                                      src={photo.url}
                                      alt={photo.title}
                                      className="w-full h-full object-cover rounded-md"
                                    />
                                  </AspectRatio>
                                  <div className="p-4">
                                    <h3 className="font-medium text-center">{photo.title}</h3>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="-left-4" />
                      <CarouselNext className="-right-4" />
                    </Carousel>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
                    {trip.photos.map((photo, index) => (
                      <div key={index} className="overflow-hidden rounded-lg">
                        <img 
                          src={photo.url} 
                          alt={photo.title}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <p className="font-medium text-center mt-2">{photo.title}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Seats Tab */}
            <TabsContent value="seats">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-4">Select Seats</h2>
                  <p className="text-gray-600 mb-6">
                    Click on a seat to select it for booking. You'll need to pay ₹2,000 per seat as advance.
                  </p>
                  
                  <div className="flex items-center justify-center space-x-6 mb-6">
                    <div className="flex items-center">
                      <div className="seat seat-available w-6 h-6 mr-2"></div>
                      <span className="text-sm">Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="seat seat-booked w-6 h-6 mr-2"></div>
                      <span className="text-sm">Booked</span>
                    </div>
                    <div className="flex items-center">
                      <div className="seat seat-selected w-6 h-6 mr-2"></div>
                      <span className="text-sm">Selected</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center mb-8">
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="mb-6 flex justify-center">
                        <div className="w-20 h-12 bg-gray-300 rounded-t-xl flex items-center justify-center text-sm">
                          Driver
                        </div>
                      </div>
                      
                      <div className="grid grid-rows-9 gap-4">
                        {seats.map((row, rowIndex) => (
                          <div key={rowIndex} className="flex gap-4 justify-center">
                            {row.map((seat, seatIndex) => (
                              seat ? (
                                <div
                                  key={seatIndex}
                                  className={`seat ${seat.booked ? 'seat-booked' : seat.selected ? 'seat-selected' : 'seat-available'}`}
                                  onClick={() => handleSeatClick(seat.id, seat.booked)}
                                >
                                  {seat.id}
                                </div>
                              ) : (
                                <div key={seatIndex} className="w-10"></div>
                              )
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      onClick={handleProceed} 
                      className="px-8" 
                      disabled={selectedSeats.length === 0}
                    >
                      Continue with {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </PageLayout>
  );
};

export default TripDetailPage;
