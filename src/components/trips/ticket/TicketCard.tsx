
import { useRef } from "react";
import { Trip, Passenger } from "@/types/trip";
import { Card, CardContent } from "@/components/ui/card";
import TicketHeader from "./TicketHeader";
import TripDetails from "./TripDetails";
import PassengerDetails from "./PassengerDetails";
import FareDetails from "./FareDetails";
import TicketFooter from "./TicketFooter";

interface TicketCardProps {
  trip: Trip;
  passenger: Passenger;
  innerRef?: React.RefObject<HTMLDivElement>;
}

const TicketCard = ({ trip, passenger, innerRef }: TicketCardProps) => {
  return (
    <Card className="border-2 border-dashed border-gray-300">
      <CardContent className="p-0">
        <div ref={innerRef} className="p-6 bg-white">
          <TicketHeader trip={trip} />
          <TripDetails trip={trip} />
          <PassengerDetails passenger={passenger} />
          <FareDetails trip={trip} passenger={passenger} />
          <TicketFooter />
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
