
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trip, Passenger } from "@/types/trip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PassengerForm from "./PassengerForm";
import PaymentGateway from "./PaymentGateway";
import TicketPreview from "./TicketPreview";

interface SeatLayoutData {
  rows: number;
  columns: number;
  aisle: number[];
  unavailableSeats: string[];
  sleeperBerths?: number;
  upperDeck?: boolean;
}

interface TripSeatsTabProps {
  selectedSeats: string[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
  seatLayout: SeatLayoutData;
  trip: Trip;
}

type BookingStep = "selectSeats" | "passengerDetails" | "payment" | "ticket";
type DeckType = "lower" | "upper";

const TripSeatsTab = ({ selectedSeats, setSelectedSeats, seatLayout, trip }: TripSeatsTabProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<BookingStep>("selectSeats");
  const [passengerData, setPassengerData] = useState<Passenger[]>([]);
  const [activeDeck, setActiveDeck] = useState<DeckType>("lower");
  
  // Create data for the 1x2 lower deck seating arrangement
  const createLowerDeckSeats = () => {
    const seats: ({ id: string; booked: boolean; selected: boolean } | null)[][] = [];
    const rowLabels = ["A", "B", "C"];
    
    for (let row = 1; row <= seatLayout.rows; row++) {
      const rowSeats: ({ id: string; booked: boolean; selected: boolean } | null)[] = [];
      
      // 1x2 configuration (one seat on left, aisle, two seats on right)
      for (let col = 0; col < 4; col++) {
        if (col === 0) {
          // Left side - single seat
          const seatId = `L${row}A`;
          const isBooked = seatLayout.unavailableSeats.includes(seatId);
          const isSelected = selectedSeats.includes(seatId);
          
          rowSeats.push({
            id: seatId,
            booked: isBooked,
            selected: isSelected
          });
        } else if (col === 1) {
          // Aisle
          rowSeats.push(null);
        } else {
          // Right side - two seats
          const seatId = `L${row}${rowLabels[col-1]}`;
          const isBooked = seatLayout.unavailableSeats.includes(seatId);
          const isSelected = selectedSeats.includes(seatId);
          
          rowSeats.push({
            id: seatId,
            booked: isBooked,
            selected: isSelected
          });
        }
      }
      seats.push(rowSeats);
    }
    return seats;
  };
  
  // Create data for the upper deck sleeper berths
  const createUpperDeckBerths = () => {
    const berths: ({ id: string; booked: boolean; selected: boolean })[][] = [];
    const berthCount = seatLayout.sleeperBerths || 6; // Default to 6 sleeper berths if not specified
    
    // Create two rows of sleeper berths (left and right sides)
    for (let side = 0; side < 2; side++) {
      const sideBerths: ({ id: string; booked: boolean; selected: boolean })[] = [];
      const sidePrefix = side === 0 ? "UL" : "UR"; // Upper Left or Upper Right
      
      for (let berth = 1; berth <= berthCount / 2; berth++) {
        const berthId = `${sidePrefix}${berth}`;
        const isBooked = seatLayout.unavailableSeats.includes(berthId);
        const isSelected = selectedSeats.includes(berthId);
        
        sideBerths.push({
          id: berthId,
          booked: isBooked,
          selected: isSelected
        });
      }
      berths.push(sideBerths);
    }
    return berths;
  };
  
  const lowerDeckSeats = createLowerDeckSeats();
  const upperDeckBerths = createUpperDeckBerths();
  
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
  
  const handleSubmitPassengerForm = (data: Passenger[]) => {
    setPassengerData(data);
    setCurrentStep("payment");
  };
  
  const handlePaymentSuccess = () => {
    setCurrentStep("ticket");
  };

  const totalAdvanceAmount = passengerData.reduce((sum, passenger) => 
    sum + (passenger.advanceAmount || 2000), 0);
  
  return (
    <Card>
      <CardContent className="pt-6">
        {currentStep === "selectSeats" && (
          <>
            <h2 className="text-2xl font-bold mb-4">Select Seats</h2>
            <p className="text-gray-600 mb-6">
              Click on a seat to select it for booking. You'll need to pay ₹2,000 per seat as minimum advance.
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
            
            <Tabs value={activeDeck} onValueChange={(value) => setActiveDeck(value as DeckType)} className="w-full mb-6">
              <TabsList className="grid w-[400px] grid-cols-2 mx-auto">
                <TabsTrigger value="lower">Lower Deck (1×2)</TabsTrigger>
                <TabsTrigger value="upper">Upper Deck (Sleeper)</TabsTrigger>
              </TabsList>
              
              <TabsContent value="lower">
                <div className="flex justify-center mb-8">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="mb-6 flex justify-center">
                      <div className="w-20 h-12 bg-gray-300 rounded-t-xl flex items-center justify-center text-sm">
                        Driver
                      </div>
                    </div>
                    
                    <div className="grid grid-rows-9 gap-4">
                      {lowerDeckSeats.map((row, rowIndex) => (
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
              </TabsContent>
              
              <TabsContent value="upper">
                <div className="flex justify-center mb-8">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="mb-4 text-center text-sm text-gray-500">Upper Deck Sleeper Berths</div>
                    
                    <div className="flex gap-16">
                      {upperDeckBerths.map((side, sideIndex) => (
                        <div key={sideIndex} className="flex flex-col gap-4">
                          {side.map((berth, berthIndex) => (
                            <div
                              key={berthIndex}
                              className={`seat sleeper-berth ${berth.booked ? 'seat-booked' : berth.selected ? 'seat-selected' : 'seat-available'}`}
                              onClick={() => handleSeatClick(berth.id, berth.booked)}
                            >
                              {berth.id}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
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
        
        {currentStep === "payment" && passengerData.length > 0 && (
          <PaymentGateway
            passengers={passengerData}
            fare={totalAdvanceAmount}
            onPaymentSuccess={handlePaymentSuccess}
          />
        )}
        
        {currentStep === "ticket" && passengerData.length > 0 && (
          <TicketPreview 
            trip={trip}
            passengers={passengerData}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TripSeatsTab;
