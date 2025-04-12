
import { Trip, Passenger } from "@/types/trip";

interface FareDetailsProps {
  trip: Trip;
  passenger: Passenger;
}

const FareDetails = ({ trip, passenger }: FareDetailsProps) => {
  const advanceAmount = passenger.advanceAmount || 2000;
  const balanceDue = trip.fare - advanceAmount;
  
  return (
    <div className="p-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">Total Fare</p>
        <p className="text-xl font-bold">₹{trip.fare}</p>
        <div className="mt-1">
          <p className="text-xs text-gray-500">Advance Paid</p>
          <p className="text-sm">₹{advanceAmount}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Balance Due</p>
          <p className="text-sm">₹{balanceDue}</p>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs text-gray-500 mb-1">Ticket ID</p>
        <div className="bg-gray-200 py-2 px-4 rounded font-mono text-sm">
          {`TKT${trip.id}${passenger.seatNumber}`}
        </div>
      </div>
    </div>
  );
};

export default FareDetails;
