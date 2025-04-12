
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Trip, Passenger } from "@/types/trip";
import PassengerForm from "./PassengerForm";
import PaymentGateway from "./PaymentGateway";
import TicketPreview from "./TicketPreview";
import SeatSelectionContent from "./seat-selection/SeatSelectionContent";
import { useSeatLayout } from "./seat-selection/useSeatLayout";

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

const TripSeatsTab = ({ selectedSeats, setSelectedSeats, seatLayout, trip }: TripSeatsTabProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<BookingStep>("selectSeats");
  const [passengerData, setPassengerData] = useState<Passenger[]>([]);
  
  const { lowerDeckSeats, upperDeckBerths, handleSeatClick } = useSeatLayout(
    seatLayout, 
    selectedSeats, 
    setSelectedSeats
  );
  
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
          <SeatSelectionContent
            selectedSeats={selectedSeats}
            lowerDeckSeats={lowerDeckSeats}
            upperDeckBerths={upperDeckBerths}
            handleSeatClick={handleSeatClick}
            handleProceedToPassengerDetails={handleProceedToPassengerDetails}
          />
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
