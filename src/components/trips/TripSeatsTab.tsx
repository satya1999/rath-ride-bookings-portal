
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Trip, Passenger } from "@/types/trip";
import PassengerForm from "./PassengerForm";
import PaymentGateway from "./PaymentGateway";
import TicketPreview from "./TicketPreview";
import SeatSelectionContent from "./seat-selection/SeatSelectionContent";
import { useSeatLayout } from "./seat-selection/useSeatLayout";
import { toast } from "sonner";
import { bookingService } from "@/services/api";

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
  const { toast: useToastHook } = useToast();
  const [currentStep, setCurrentStep] = useState<BookingStep>("selectSeats");
  const [passengerData, setPassengerData] = useState<Passenger[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch already booked seats for this trip
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const bookedSeats = await bookingService.getTripBookedSeats(trip.id);
        
        // Update unavailable seats with already booked seats
        const updatedLayout = {
          ...seatLayout,
          unavailableSeats: [...seatLayout.unavailableSeats, ...bookedSeats]
        };
        
        setBookedSeats(bookedSeats);
        
        // Update seatLayout.unavailableSeats with real booked seats
        seatLayout.unavailableSeats = updatedLayout.unavailableSeats;
        
      } catch (error) {
        console.error("Error in fetchBookedSeats:", error);
        setError("Failed to load seat availability. Please try again later.");
        toast.error("Failed to fetch seat availability");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBookedSeats();
  }, [trip.id]);
  
  const { lowerDeckSeats, upperDeckBerths, handleSeatClick } = useSeatLayout(
    seatLayout, 
    selectedSeats, 
    setSelectedSeats
  );
  
  const handleProceedToPassengerDetails = () => {
    if (selectedSeats.length === 0) {
      useToastHook({
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

  const handleSaveLayout = () => {
    const layoutData = {
      name: "1X2 Bus Sleeper Layout",
      type: "sleeper",
      configuration: {
        lowerDeckSeats,
        upperDeckBerths
      }
    };
    
    localStorage.setItem('lastBusLayout', JSON.stringify(layoutData));
    
    toast.success("1X2 Bus Layout saved successfully. View it in the admin panel.");
  };

  const totalAdvanceAmount = passengerData.reduce((sum, passenger) => 
    sum + (passenger.advanceAmount || 2000), 0);
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Checking seat availability...</h3>
              <p className="text-gray-500">Please wait while we fetch the latest seat information.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2 text-red-500">Error Loading Seats</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
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
            onSaveLayout={handleSaveLayout}
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
            tripId={trip.id}
            selectedSeats={selectedSeats}
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
