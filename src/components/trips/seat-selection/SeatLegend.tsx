
import React from "react";

const SeatLegend = () => {
  return (
    <div className="flex items-center justify-center space-x-6 mb-6">
      <div className="flex items-center">
        <div className="seat seat-available w-6 h-6 mr-2"></div>
        <span className="text-sm">Available</span>
      </div>
      <div className="flex items-center">
        <div className="seat seat-booked w-6 h-6 mr-2"></div>
        <span className="text-sm">Booked</span>
      </div>
      <div className="flex items-center">
        <div className="seat seat-selected w-6 h-6 mr-2"></div>
        <span className="text-sm">Selected</span>
      </div>
    </div>
  );
};

export default SeatLegend;
