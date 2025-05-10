
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Square } from "lucide-react";

interface Seater2x2LayoutProps {
  seats: ({ id: string; booked: boolean; selected: boolean })[][];
  onSeatClick: (seatId: string, isBooked: boolean) => void;
}

const Seater2x2Layout = ({ seats, onSeatClick }: Seater2x2LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="text-center text-xl font-bold mb-6">
          2X2 Push Back Seat
        </div>
        
        <div className="seater-2x2">
          {Array.from({ length: 10 }).map((_, rowIndex) => (
            <React.Fragment key={`row-${rowIndex + 1}`}>
              {/* Left side - 2 seats */}
              <div
                className={`seat ${seats[rowIndex]?.[0]?.booked ? 'seat-booked' : seats[rowIndex]?.[0]?.selected ? 'seat-selected' : 'seat-available'}`}
                onClick={() => seats[rowIndex]?.[0] && onSeatClick(seats[rowIndex][0].id, seats[rowIndex][0].booked)}
              >
                {seats[rowIndex]?.[0]?.id || `L${rowIndex * 2 + 1}`}
              </div>
              
              <div
                className={`seat ${seats[rowIndex]?.[1]?.booked ? 'seat-booked' : seats[rowIndex]?.[1]?.selected ? 'seat-selected' : 'seat-available'}`}
                onClick={() => seats[rowIndex]?.[1] && onSeatClick(seats[rowIndex][1].id, seats[rowIndex][1].booked)}
              >
                {seats[rowIndex]?.[1]?.id || `L${rowIndex * 2 + 2}`}
              </div>
              
              {/* Aisle */}
              <div className="aisle"></div>
              
              {/* Right side - 2 seats */}
              <div
                className={`seat ${seats[rowIndex]?.[2]?.booked ? 'seat-booked' : seats[rowIndex]?.[2]?.selected ? 'seat-selected' : 'seat-available'}`}
                onClick={() => seats[rowIndex]?.[2] && onSeatClick(seats[rowIndex][2].id, seats[rowIndex][2].booked)}
              >
                {seats[rowIndex]?.[2]?.id || `R${rowIndex * 2 + 1}`}
              </div>
              
              <div
                className={`seat ${seats[rowIndex]?.[3]?.booked ? 'seat-booked' : seats[rowIndex]?.[3]?.selected ? 'seat-selected' : 'seat-available'}`}
                onClick={() => seats[rowIndex]?.[3] && onSeatClick(seats[rowIndex][3].id, seats[rowIndex][3].booked)}
              >
                {seats[rowIndex]?.[3]?.id || `R${rowIndex * 2 + 2}`}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Seater2x2Layout;
