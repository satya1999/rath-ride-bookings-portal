
import React from "react";

interface UpperDeckBerthsProps {
  berths: ({ id: string; booked: boolean; selected: boolean })[][];
  onBerthClick: (berthId: string, isBooked: boolean) => void;
}

const UpperDeckBerths = ({ berths, onBerthClick }: UpperDeckBerthsProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="mb-6 text-center text-xl font-bold">Sleepers</div>
        
        <div className="flex gap-16">
          {/* Left side berths (SL1-SL5) */}
          <div className="flex flex-col gap-4">
            {berths[0].map((berth, berthIndex) => (
              <div
                key={`left-${berthIndex}`}
                className={`sleeper-berth ${berth.booked ? 'seat-booked' : berth.selected ? 'seat-selected' : 'seat-available'}`}
                onClick={() => onBerthClick(berth.id, berth.booked)}
              >
                {berth.id}
              </div>
            ))}
          </div>
          
          {/* Right side berths (SR1-SR10) in pairs */}
          <div className="flex flex-col gap-4">
            {berths[1].map((berth, berthIndex) => (
              berthIndex % 2 === 0 && (
                <div key={`right-row-${berthIndex}`} className="flex gap-4">
                  <div
                    className={`sleeper-berth ${berth.booked ? 'seat-booked' : berth.selected ? 'seat-selected' : 'seat-available'}`}
                    onClick={() => onBerthClick(berth.id, berth.booked)}
                  >
                    {berth.id}
                  </div>
                  {berthIndex + 1 < berths[1].length && (
                    <div
                      className={`sleeper-berth ${
                        berths[1][berthIndex + 1].booked 
                          ? 'seat-booked' 
                          : berths[1][berthIndex + 1].selected 
                            ? 'seat-selected' 
                            : 'seat-available'
                      }`}
                      onClick={() => onBerthClick(berths[1][berthIndex + 1].id, berths[1][berthIndex + 1].booked)}
                    >
                      {berths[1][berthIndex + 1].id}
                    </div>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpperDeckBerths;
