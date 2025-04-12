
import React from "react";

interface LowerDeckSeatsProps {
  seats: ({ id: string; booked: boolean; selected: boolean } | null)[][];
  onSeatClick: (seatId: string, isBooked: boolean) => void;
}

const LowerDeckSeats = ({ seats, onSeatClick }: LowerDeckSeatsProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="text-center text-xl font-bold mb-6">
          1X2 Push Back Seat
        </div>
        
        <div className="flex gap-16">
          {/* Left side seats (L1-L10) */}
          <div className="flex flex-col gap-4">
            {seats.map((row, rowIndex) => (
              row[0] && (
                <div
                  key={`left-${rowIndex}`}
                  className={`seat ${row[0].booked ? 'seat-booked' : row[0].selected ? 'seat-selected' : 'seat-available'}`}
                  onClick={() => onSeatClick(row[0].id, row[0].booked)}
                >
                  {row[0].id}
                </div>
              )
            ))}
          </div>
          
          {/* Gap in the middle */}
          <div className="flex flex-col justify-center">
            <div className="h-full flex items-center">
              <div className="transform -rotate-90 text-gray-500 font-semibold whitespace-nowrap">
                {/* This vertical text is removed as it's not in the reference image */}
              </div>
            </div>
          </div>
          
          {/* Right side seats (R1-R20) */}
          <div className="flex flex-col gap-4">
            {seats.map((row, rowIndex) => (
              <div key={`right-row-${rowIndex}`} className="flex gap-4">
                {row.slice(2).map((seat, seatIndex) => (
                  seat && (
                    <div
                      key={`right-${rowIndex}-${seatIndex}`}
                      className={`seat ${seat.booked ? 'seat-booked' : seat.selected ? 'seat-selected' : 'seat-available'}`}
                      onClick={() => onSeatClick(seat.id, seat.booked)}
                    >
                      {seat.id}
                    </div>
                  )
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowerDeckSeats;
