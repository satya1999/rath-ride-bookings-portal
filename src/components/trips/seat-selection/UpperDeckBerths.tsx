
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";

interface UpperDeckBerthsProps {
  berths: ({ id: string; booked: boolean; selected: boolean })[][];
  onBerthClick: (berthId: string, isBooked: boolean) => void;
  onSaveLayout?: () => void;
}

const UpperDeckBerths = ({ berths, onBerthClick, onSaveLayout }: UpperDeckBerthsProps) => {
  const isMobile = useIsMobile();
  const { toast: useToastHook } = useToast();
  
  const handleSaveLayout = () => {
    if (onSaveLayout) {
      onSaveLayout();
    } else {
      // If no handler is provided, use the default save function
      const layoutData = {
        name: "1X2 Bus Sleeper Layout",
        type: "sleeper",
        configuration: {
          upperDeckBerths: berths,
          // We would include lowerDeckSeats here in a full implementation
        }
      };
      
      // Store in local storage for now
      localStorage.setItem('lastBusLayout', JSON.stringify(layoutData));
      
      // Use sonner toast for consistent UI
      toast.success("1X2 Bus Layout saved successfully. View it in the admin panel.");
    }
  };
  
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="bg-gray-100 p-4 sm:p-6 rounded-lg">
        <div className="mb-6 text-center text-lg sm:text-xl font-bold">1X2 Push Back Sleeper</div>
        
        <div className={`relative flex ${isMobile ? "gap-24" : "gap-28"}`}>
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
                <div key={`right-row-${berthIndex}`} className="flex gap-3">
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
      
      {/* Save Layout Button */}
      <Button 
        className="mt-4 flex items-center gap-2" 
        onClick={handleSaveLayout}
        variant="secondary"
      >
        <Save size={16} />
        Save as 1X2 Bus Layout
      </Button>
    </div>
  );
};

export default UpperDeckBerths;
