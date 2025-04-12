
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Passenger } from "@/types/trip";
import PassengerTabs from "./passenger-form/PassengerTabs";
import PassengerFormFields from "./passenger-form/PassengerFormFields";

interface PassengerFormProps {
  selectedSeats: string[];
  onSubmit: (data: Passenger[]) => void;
}

const PassengerForm = ({ selectedSeats, onSubmit }: PassengerFormProps) => {
  const { toast } = useToast();
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const [passengers, setPassengers] = useState<Passenger[]>([]);

  const handleSubmitPassenger = (passengerData: Passenger) => {
    if (currentPassengerIndex < selectedSeats.length - 1) {
      // Add or update current passenger and move to next seat
      const updatedPassengers = [...passengers];
      
      if (currentPassengerIndex < passengers.length) {
        // Update existing passenger
        updatedPassengers[currentPassengerIndex] = passengerData;
      } else {
        // Add new passenger
        updatedPassengers.push(passengerData);
      }
      
      setPassengers(updatedPassengers);
      setCurrentPassengerIndex(currentPassengerIndex + 1);
      
      toast({
        title: "Passenger added",
        description: `Passenger ${currentPassengerIndex + 1} details saved. Please enter details for Passenger ${currentPassengerIndex + 2}.`,
      });
    } else {
      // Submit all passengers' data for the last passenger
      let allPassengers = [...passengers];
      
      if (currentPassengerIndex < passengers.length) {
        // Update existing last passenger
        allPassengers[currentPassengerIndex] = passengerData;
      } else {
        // Add new last passenger
        allPassengers.push(passengerData);
      }
      
      onSubmit(allPassengers);
    }
  };
  
  const handleTabChange = (tabIndex: number) => {
    setCurrentPassengerIndex(tabIndex);
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-6">Passenger Details</h2>
        {selectedSeats.length > 1 && (
          <div className="mb-6">
            <PassengerTabs
              passengers={Array.from({ length: selectedSeats.length }, (_, i) => i)}
              currentPassengerIndex={currentPassengerIndex}
              onChange={handleTabChange}
              completedIndices={Array.from({ length: passengers.length }, (_, i) => i)}
              selectedSeats={selectedSeats}
            />
          </div>
        )}
        
        <PassengerFormFields
          seatNumber={selectedSeats[currentPassengerIndex]}
          isLastPassenger={currentPassengerIndex === selectedSeats.length - 1}
          onSubmit={handleSubmitPassenger}
          onPrevious={currentPassengerIndex > 0 ? () => setCurrentPassengerIndex(currentPassengerIndex - 1) : undefined}
          initialValues={passengers[currentPassengerIndex]}
        />
      </CardContent>
    </Card>
  );
};

export default PassengerForm;
