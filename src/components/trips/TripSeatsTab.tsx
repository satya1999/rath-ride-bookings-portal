
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Trip, Passenger } from "@/types/trip";
import PassengerForm from "./PassengerForm";
import PaymentGateway from "./PaymentGateway";
import TicketPreview from "./TicketPreview";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BusFront, Bed } from "lucide-react";

interface SeatLayoutData {
  lowerDeck: {
    rows: number;
    columns: number;
    aisle: number[];
    unavailableSeats: string[];
  };
  upperDeck: {
    leftSleepers: number;
    rightDoubleSleepers: number;
    unavailableBerths: string[];
  };
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
  const [passengerData, setPassengerData] = useState<Passenger[]>([]);
  const [activeDeck, setActiveDeck] = useState<"lower" | "upper">("lower");
  
  // Generate lower deck seats arrangement (1x2 configuration)
  const lowerDeckSeats: ({ id: string; booked: boolean; selected: boolean } | null)[][] = [];
  const rowLabels = ["A", "B", "C"];
  
  for (let row = 1; row <= seatLayout.lowerDeck.rows; row++) {
    const rowSeats: ({ id: string; booked: boolean; selected: boolean } | null)[] = [];
    for (let col = 0; col < seatLayout.lowerDeck.columns; col++) {
      const isAisle = seatLayout.lowerDeck.aisle.includes(col);
      
      if (!isAisle) {
        const seatId = `${row}${rowLabels[col]}`;
        const isBooked = seatLayout.lowerDeck.unavailableSeats.includes(seatId);
        const isSelected = selectedSeats.includes(seatId);
        
        rowSeats.push({
          id: seatId,
          booked: isBooked,
          selected: isSelected
        });
      } else {
        rowSeats.push(null); // Aisle
      }
    }
    lowerDeckSeats.push(rowSeats);
  }
  
  // Generate upper deck sleeper berths
  const leftSleeperBerths = Array.from({ length: seatLayout.upperDeck.leftSleepers }, (_, i) => {
    const berthId = `SL${i + 1}`;
    const isBooked = seatLayout.upperDeck.unavailableBerths.includes(berthId);
    const isSelected = selectedSeats.includes(berthId);
    
    return {
      id: berthId,
      booked: isBooked,
      selected: isSelected
    };
  });
  
  // Generate upper deck double sleeper berths
  const rightDoubleSleeperBerths = Array.from({ length: seatLayout.upperDeck.rightDoubleSleepers }, (_, i) => {
    const berthId = `DSR${i + 1}`;
    const isBooked = seatLayout.upperDeck.unavailableBerths.includes(berthId);
    const isSelected = selectedSeats.includes(berthId);
    
    return {
      id: berthId,
      booked: isBooked,
      selected: isSelected
    };
  });
  
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
              Click on a seat or berth to select it for booking. You'll need to pay ₹2,000 per seat as minimum advance.
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
            
            <Tabs defaultValue="lower" value={activeDeck} onValueChange={(value) => setActiveDeck(value as "lower" | "upper")} className="w-full mb-6">
              <TabsList className="grid grid-cols-2 w-48 mx-auto">
                <TabsTrigger value="lower" className="flex items-center gap-2">
                  <BusFront className="h-4 w-4" />
                  <span>Lower Deck</span>
                </TabsTrigger>
                <TabsTrigger value="upper" className="flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  <span>Upper Deck</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="lower">
                <div className="flex justify-center">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="mb-6 flex justify-center">
                      <div className="w-20 h-12 bg-gray-300 rounded-t-xl flex items-center justify-center text-sm">
                        Driver
                      </div>
                    </div>
                    
                    <div className="grid grid-rows-6 gap-4">
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
                <div className="flex justify-center">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="deck-label">Upper Deck - Sleeper Berths</div>
                    
                    <div className="flex gap-8">
                      {/* Left side - Single sleeper berths */}
                      <div className="flex flex-col gap-2">
                        <div className="text-sm font-medium mb-1 text-center">Left Side</div>
                        {leftSleeperBerths.map((berth, index) => (
                          <div
                            key={index}
                            className={`sleeper ${berth.booked ? 'sleeper-booked' : berth.selected ? 'sleeper-selected' : 'sleeper-available'}`}
                            onClick={() => handleSeatClick(berth.id, berth.booked)}
                          >
                            {berth.id}
                          </div>
                        ))}
                      </div>
                      
                      {/* Center aisle */}
                      <div className="w-4"></div>
                      
                      {/* Right side - Double sleeper berths */}
                      <div className="flex flex-col gap-2">
                        <div className="text-sm font-medium mb-1 text-center">Right Side</div>
                        {rightDoubleSleeperBerths.map((berth, index) => (
                          <div
                            key={index}
                            className={`double-sleeper ${berth.booked ? 'double-sleeper-booked' : berth.selected ? 'double-sleeper-selected' : 'double-sleeper-available'}`}
                            onClick={() => handleSeatClick(berth.id, berth.booked)}
                          >
                            {berth.id}
                          </div>
                        ))}
                      </div>
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
