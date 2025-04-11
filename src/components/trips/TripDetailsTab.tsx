
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, IndianRupee, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Trip } from "@/types/trip";

interface TripDetailsTabProps {
  trip: Trip;
  selectedSeats: string[];
  onSelectSeatsClick: () => void;
}

const TripDetailsTab = ({ trip, selectedSeats, onSelectSeatsClick }: TripDetailsTabProps) => {
  const totalAmount = selectedSeats.length * 2000; // ₹2000 per seat

  return (
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
                <p className="text-gray-600">{trip.formattedDate}</p>
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
                onClick={onSelectSeatsClick}
              >
                Select Seats
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TripDetailsTab;
