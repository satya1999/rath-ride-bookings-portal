
import { Trip } from "@/types/trip";
import { Check } from "lucide-react";

interface TicketHeaderProps {
  trip: Trip;
}

const TicketHeader = ({ trip }: TicketHeaderProps) => {
  // Generate a unique booking reference based on trip id and date
  const bookingRef = `AR-${trip.id}${new Date().getTime().toString().slice(-6)}`;
  
  return (
    <div className="bg-purple-600 text-white p-4 rounded-t-lg">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">E-Ticket</h3>
          <div className="flex items-center mt-1">
            <Check className="h-4 w-4 mr-1" /> 
            <span className="text-xs opacity-90">Payment Received</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm">{trip.formattedDate}</p>
          <p className="text-xs opacity-90">Booking Ref: {bookingRef}</p>
        </div>
      </div>
    </div>
  );
};

export default TicketHeader;
