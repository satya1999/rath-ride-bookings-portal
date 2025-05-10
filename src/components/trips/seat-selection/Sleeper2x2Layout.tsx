
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { BedDouble } from "lucide-react";

interface Sleeper2x2LayoutProps {
  berths: ({ id: string; booked: boolean; selected: boolean })[][];
  onBerthClick: (berthId: string, isBooked: boolean) => void;
}

const Sleeper2x2Layout = ({ berths, onBerthClick }: Sleeper2x2LayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-100 p-6 rounded-lg">
        <div className="text-center text-xl font-bold mb-6">
          2X2 Sleeper Layout
        </div>
        
        <div className={`grid grid-cols-2 gap-8 ${isMobile ? "" : "px-8"}`}>
          {/* Left Side */}
          <div className="flex flex-col gap-6">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={`left-row-${rowIndex + 1}`} className="flex gap-4">
                {/* Left side berths (a) and (b) */}
                <div
                  className={`sleeper-berth ${berths[0]?.[rowIndex * 2]?.booked ? 'seat-booked' : berths[0]?.[rowIndex * 2]?.selected ? 'seat-selected' : 'seat-available'}`}
                  onClick={() => berths[0]?.[rowIndex * 2] && onBerthClick(berths[0][rowIndex * 2].id, berths[0][rowIndex * 2].booked)}
                >
                  {berths[0]?.[rowIndex * 2]?.id || `SL${rowIndex + 1}(a)`}
                </div>
                
                <div
                  className={`sleeper-berth ${berths[0]?.[rowIndex * 2 + 1]?.booked ? 'seat-booked' : berths[0]?.[rowIndex * 2 + 1]?.selected ? 'seat-selected' : 'seat-available'}`}
                  onClick={() => berths[0]?.[rowIndex * 2 + 1] && onBerthClick(berths[0][rowIndex * 2 + 1].id, berths[0][rowIndex * 2 + 1].booked)}
                >
                  {berths[0]?.[rowIndex * 2 + 1]?.id || `SL${rowIndex + 1}(b)`}
                </div>
              </div>
            ))}
          </div>
          
          {/* Right Side */}
          <div className="flex flex-col gap-6">
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={`right-row-${rowIndex + 1}`} className="flex gap-4">
                {/* Right side berths (a) and (b) */}
                <div
                  className={`sleeper-berth ${berths[1]?.[rowIndex * 2]?.booked ? 'seat-booked' : berths[1]?.[rowIndex * 2]?.selected ? 'seat-selected' : 'seat-available'}`}
                  onClick={() => berths[1]?.[rowIndex * 2] && onBerthClick(berths[1][rowIndex * 2].id, berths[1][rowIndex * 2].booked)}
                >
                  {berths[1]?.[rowIndex * 2]?.id || `SR${rowIndex + 1}(a)`}
                </div>
                
                <div
                  className={`sleeper-berth ${berths[1]?.[rowIndex * 2 + 1]?.booked ? 'seat-booked' : berths[1]?.[rowIndex * 2 + 1]?.selected ? 'seat-selected' : 'seat-available'}`}
                  onClick={() => berths[1]?.[rowIndex * 2 + 1] && onBerthClick(berths[1][rowIndex * 2 + 1].id, berths[1][rowIndex * 2 + 1].booked)}
                >
                  {berths[1]?.[rowIndex * 2 + 1]?.id || `SR${rowIndex + 1}(b)`}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sleeper2x2Layout;
