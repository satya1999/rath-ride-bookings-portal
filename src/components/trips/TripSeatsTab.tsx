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
import { bookingService } from "@/services";
interface SeatLayoutData {
  rows: number;
  columns: number;
  aisle: number[];
  unavailableSeats: string[];
  sleeperBerths?: number;
  upperDeck?: boolean;
  layout?: string;
  type?: string;
}
interface TripSeatsTabProps {
  selectedSeats: string[];
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>;
  seatLayout: SeatLayoutData;
  trip: Trip;
  layoutType?: string;
}
type BookingStep = "selectSeats" | "passengerDetails" | "payment" | "ticket";
const TripSeatsTab = ({
  selectedSeats,
  setSelectedSeats,
  seatLayout,
  trip,
  layoutType = "1x2"
}: TripSeatsTabProps) => {
  const {
    toast: useToastHook
  } = useToast();
  const [currentStep, setCurrentStep] = useState<BookingStep>("selectSeats");
  const [passengerData, setPassengerData] = useState<Passenger[]>([]);
  const [bookedSeats, setBookedSeats] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Set the layout type in the seat layout data
  const updatedSeatLayout = {
    ...seatLayout,
    layout: layoutType,
    type: seatLayout.upperDeck ? "sleeper" : "seater"
  };
  useEffect(() => {
    const fetchBookedSeats = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const bookedSeats = await bookingService.getTripBookedSeats(trip.id);
        const updatedLayout = {
          ...updatedSeatLayout,
          unavailableSeats: [...updatedSeatLayout.unavailableSeats, ...bookedSeats]
        };
        setBookedSeats(bookedSeats);
        updatedSeatLayout.unavailableSeats = updatedLayout.unavailableSeats;
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
  const {
    lowerDeckSeats,
    upperDeckBerths,
    handleSeatClick
  } = useSeatLayout(updatedSeatLayout, selectedSeats, setSelectedSeats);
  const handleProceedToPassengerDetails = () => {
    if (selectedSeats.length === 0) {
      useToastHook({
        title: "No seats selected",
        description: "Please select at least one seat to proceed.",
        variant: "destructive"
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
      name: `${layoutType} Bus ${updatedSeatLayout.upperDeck ? "Sleeper" : "Seater"} Layout`,
      type: updatedSeatLayout.upperDeck ? "sleeper" : "seater",
      configuration: {
        lowerDeckSeats,
        upperDeckBerths,
        layout: layoutType
      }
    };
    localStorage.setItem('lastBusLayout', JSON.stringify(layoutData));
    toast.success(`${layoutType} Bus Layout saved successfully. View it in the admin panel.`);
  };
  const totalAdvanceAmount = passengerData.reduce((sum, passenger) => sum + (passenger.advanceAmount || 2000), 0);
  if (isLoading) {
    return <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Checking seat availability...</h3>
              <p className="text-gray-500">Please wait while we fetch the latest seat information.</p>
            </div>
          </div>
        </CardContent>
      </Card>;
  }
  if (error) {
    return <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2 text-red-500">Error Loading Seats</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => window.location.reload()}>
                Try Again
              </button>
            </div>
          </div>
        </CardContent>
      </Card>;
  }
  return <Card>
      <CardContent className="pt-6 px-[20px]">
        {currentStep === "selectSeats" && <SeatSelectionContent selectedSeats={selectedSeats} lowerDeckSeats={lowerDeckSeats} upperDeckBerths={upperDeckBerths} handleSeatClick={handleSeatClick} handleProceedToPassengerDetails={handleProceedToPassengerDetails} onSaveLayout={handleSaveLayout} layoutType={layoutType} />}
        
        {currentStep === "passengerDetails" && <PassengerForm selectedSeats={selectedSeats} onSubmit={handleSubmitPassengerForm} />}
        
        {currentStep === "payment" && passengerData.length > 0 && <PaymentGateway passengers={passengerData} fare={totalAdvanceAmount} onPaymentSuccess={handlePaymentSuccess} tripId={trip.id} selectedSeats={selectedSeats} />}
        
        {currentStep === "ticket" && passengerData.length > 0 && <TicketPreview trip={trip} passengers={passengerData} />}
      </CardContent>
    </Card>;
};
export default TripSeatsTab;