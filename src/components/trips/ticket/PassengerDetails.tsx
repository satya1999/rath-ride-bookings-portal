
import { Passenger } from "@/types/trip";

interface PassengerDetailsProps {
  passenger: Passenger;
}

const PassengerDetails = ({ passenger }: PassengerDetailsProps) => {
  return (
    <div className="p-4 border-b border-gray-200">
      <h4 className="font-medium mb-2">Passenger Details</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium">{passenger.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Mobile</p>
          <p className="font-medium">{passenger.mobile}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Age</p>
          <p className="font-medium">{passenger.age}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Seat Number</p>
          <p className="font-medium">{passenger.seatNumber}</p>
        </div>
        {passenger.bloodGroup && (
          <div>
            <p className="text-sm text-gray-500">Blood Group</p>
            <p className="font-medium">{passenger.bloodGroup}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerDetails;
