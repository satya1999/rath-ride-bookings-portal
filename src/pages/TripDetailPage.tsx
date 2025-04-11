
import { useState } from "react";
import { useParams } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Clock, IndianRupee, User, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

// For the MVP, we'll use mock data
// In a real application, this would come from an API
const mockTrip = {
  id: "1",
  title: "Deluxe Trip to Puri",
  description: "Enjoy a comfortable journey to the holy city of Puri in our deluxe air-conditioned bus. The trip includes stops at scenic viewpoints and refreshment breaks.",
  from: "Bhubaneswar",
  to: "Puri",
  date: new Date(2025, 3, 15),
  departureTime: "08:00 AM",
  arrivalTime: "11:00 AM",
  fare: 2500,
  availableSeats: 32,
  totalSeats: 36,
  busType: "Seater",
  imageUrl: "https://source.unsplash.com/random/800x400/?puri,temple",
  amenities: ["Air Conditioning", "Comfortable Seating", "Entertainment System", "Charging Points"]
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
          
          {/* Trip Details */}
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
                      disabled={selectedSeats.length === 0}
                      onClick={handleProceed}
                    >
                      Proceed to Book
                    </Button>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      You'll pay ₹2,000 per seat now and the rest at boarding
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Seat Selection */}
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
        </div>
      )}
    </PageLayout>
  );
};

export default TripDetailPage;
