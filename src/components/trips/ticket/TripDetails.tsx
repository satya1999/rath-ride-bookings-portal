
import { Trip } from "@/types/trip";

interface TripDetailsProps {
  trip: Trip;
}

const TripDetails = ({ trip }: TripDetailsProps) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-xl font-bold mb-2">{trip.title}</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">From</p>
          <p className="font-medium">{trip.from}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">To</p>
          <p className="font-medium">{trip.to}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Departure</p>
          <p className="font-medium">{trip.departureTime}, {trip.formattedDate}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Bus Type</p>
          <p className="font-medium">{trip.busType}</p>
        </div>
      </div>
    </div>
  );
};

export default TripDetails;
