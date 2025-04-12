
import React from "react";

interface LowerDeckSeatsProps {
  seats: ({ id: string; booked: boolean; selected: boolean } | null)[][];
  onSeatClick: (seatId: string, isBooked: boolean) => void;
}

const LowerDeckSeats = ({ seats, onSeatClick }: LowerDeckSeatsProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-12 bg-gray-300 rounded-t-xl flex items-center justify-center text-sm">
            Driver
          </div>
        </div>
        
        <div className="grid grid-rows-9 gap-4">
          {seats.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 justify-center">
              {row.map((seat, seatIndex) => (
                seat ? (
                  <div
                    key={seatIndex}
                    className={`seat ${seat.booked ? 'seat-booked' : seat.selected ? 'seat-selected' : 'seat-available'}`}
                    onClick={() => onSeatClick(seat.id, seat.booked)}
                  >
                    {seat.id}
                  </div>
                ) : (
                  <div key={seatIndex} className="w-10"></div>
                )
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LowerDeckSeats;
