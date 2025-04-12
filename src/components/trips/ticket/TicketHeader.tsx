
import { Trip } from "@/types/trip";

interface TicketHeaderProps {
  trip: Trip;
}

const TicketHeader = ({ trip }: TicketHeaderProps) => {
  return (
    <div className="bg-purple-600 text-white p-4 rounded-t-lg">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold">E-Ticket</h3>
        <p className="text-sm">{trip.formattedDate}</p>
      </div>
    </div>
  );
};

export default TicketHeader;
