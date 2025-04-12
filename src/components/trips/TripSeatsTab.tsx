
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trip, Passenger } from "@/types/trip";
import PassengerForm from "./PassengerForm";
import PaymentGateway from "./PaymentGateway";
import TicketPreview from "./TicketPreview";

interface SeatLayoutData {
  rows: number;
  columns: number;
  aisle: number[];
  unavailableSeats: string[];
}

interface TripSeatsTabProps {
  selectedSeats: string[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
  seatLayout: SeatLayoutData;
  trip: Trip;
}

type BookingStep = "selectSeats" | "passengerDetails" | "payment" | "ticket";

const TripSeatsTab = ({ selectedSeats, setSelectedSeats, seatLayout, trip }: TripSeatsTabProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<BookingStep>("selectSeats");
  const [passengerData, setPassengerData] = useState<Passenger | null>(null);
  
  // Generate seat layout
  const seats: ({ id: string; booked: boolean; selected: boolean } | null)[][] = [];
  const rowLabels = ["A", "B", "C", "D"];
  
  for (let row = 1; row <= seatLayout.rows; row++) {
    const rowSeats: ({ id: string; booked: boolean; selected: boolean } | null)[] = [];
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
  
  const handleProceedToPassengerDetails = () => {
    if (selectedSeats.length === 0) {
      toast({
        title: "No seats selected",
        description: "Please select at least one seat to proceed.",
        variant: "destructive",
      });
      return;
    }
    
    setCurrentStep("passengerDetails");
  };
  
  const handleSubmitPassengerForm = (data: Passenger) => {
    setPassengerData(data);
    setCurrentStep("payment");
  };
  
  const handlePaymentSuccess = () => {
    setCurrentStep("ticket");
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        {currentStep === "selectSeats" && (
          <>
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
                onClick={handleProceedToPassengerDetails} 
                className="px-8" 
                disabled={selectedSeats.length === 0}
              >
                Continue with {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
              </Button>
            </div>
          </>
        )}
        
        {currentStep === "passengerDetails" && (
          <PassengerForm
            selectedSeats={selectedSeats}
            onSubmit={handleSubmitPassengerForm}
          />
        )}
        
        {currentStep === "payment" && passengerData && (
          <PaymentGateway
            passenger={passengerData}
            fare={trip.fare}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
        
        {currentStep === "ticket" && passengerData && (
          <TicketPreview 
            trip={trip}
            passenger={passengerData}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TripSeatsTab;
