
import React from "react";

interface UpperDeckBerthsProps {
  berths: ({ id: string; booked: boolean; selected: boolean })[][];
  onBerthClick: (berthId: string, isBooked: boolean) => void;
}

const UpperDeckBerths = ({ berths, onBerthClick }: UpperDeckBerthsProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="mb-4 text-center text-sm text-gray-500">Upper Deck Sleeper Berths</div>
        
        <div className="flex gap-16">
          {berths.map((side, sideIndex) => (
            <div key={sideIndex} className="flex flex-col gap-4">
              {side.map((berth, berthIndex) => (
                <div
                  key={berthIndex}
                  className={`seat sleeper-berth ${berth.booked ? 'seat-booked' : berth.selected ? 'seat-selected' : 'seat-available'}`}
                  onClick={() => onBerthClick(berth.id, berth.booked)}
                >
                  {berth.id}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpperDeckBerths;
