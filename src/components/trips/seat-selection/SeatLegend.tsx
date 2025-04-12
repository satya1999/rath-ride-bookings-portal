
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const SeatLegend = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex items-center ${isMobile ? "flex-wrap justify-start gap-4" : "justify-center space-x-6"} mb-6`}>
      <div className="flex items-center">
        <div className="w-6 h-6 bg-green-100 border-2 border-green-500 rounded-md mr-2"></div>
        <span className="text-sm">Available</span>
      </div>
      <div className="flex items-center">
        <div className="w-6 h-6 bg-red-100 border-2 border-red-300 text-red-500 rounded-md mr-2"></div>
        <span className="text-sm">Booked</span>
      </div>
      <div className="flex items-center">
        <div className="w-6 h-6 bg-amber-100 border-2 border-amber-500 text-amber-700 rounded-md mr-2"></div>
        <span className="text-sm">Selected</span>
      </div>
    </div>
  );
};

export default SeatLegend;
