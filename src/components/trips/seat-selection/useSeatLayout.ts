
import { useState } from "react";

interface SeatLayoutData {
  rows: number;
  columns: number;
  aisle: number[];
  unavailableSeats: string[];
  sleeperBerths?: number;
  upperDeck?: boolean;
}

export const useSeatLayout = (seatLayout: SeatLayoutData, selectedSeats: string[], setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>) => {
  // Create data for the 1x2 lower deck seating arrangement with simple numbering
  const createLowerDeckSeats = () => {
    const seats: ({ id: string; booked: boolean; selected: boolean } | null)[][] = [];
    let seatNumber = 1;
    
    for (let row = 1; row <= seatLayout.rows; row++) {
      const rowSeats: ({ id: string; booked: boolean; selected: boolean } | null)[] = [];
      
      // 1x2 configuration (one seat on left, aisle, two seats on right)
      for (let col = 0; col < 4; col++) {
        if (col === 0) {
          // Left side - single seat
          const seatId = String(seatNumber);
          const isBooked = seatLayout.unavailableSeats.includes(seatId);
          const isSelected = selectedSeats.includes(seatId);
          
          rowSeats.push({
            id: seatId,
            booked: isBooked,
            selected: isSelected
          });
          seatNumber++;
        } else if (col === 1) {
          // Aisle
          rowSeats.push(null);
        } else {
          // Right side - two seats
          const seatId = String(seatNumber);
          const isBooked = seatLayout.unavailableSeats.includes(seatId);
          const isSelected = selectedSeats.includes(seatId);
          
          rowSeats.push({
            id: seatId,
            booked: isBooked,
            selected: isSelected
          });
          seatNumber++;
        }
      }
      seats.push(rowSeats);
    }
    return seats;
  };
  
  // Create data for the upper deck sleeper berths with simple numbering
  const createUpperDeckBerths = () => {
    const berths: ({ id: string; booked: boolean; selected: boolean })[][] = [];
    const berthCount = seatLayout.sleeperBerths || 10; // 5 on each side
    let seatNumber = 28; // Start numbering after the lower deck seats
    
    // Create two rows of sleeper berths (left and right sides)
    for (let side = 0; side < 2; side++) {
      const sideBerths: ({ id: string; booked: boolean; selected: boolean })[] = [];
      
      for (let berth = 1; berth <= berthCount / 2; berth++) {
        const berthId = String(seatNumber);
        const isBooked = seatLayout.unavailableSeats.includes(berthId);
        const isSelected = selectedSeats.includes(berthId);
        
        sideBerths.push({
          id: berthId,
          booked: isBooked,
          selected: isSelected
        });
        seatNumber++;
      }
      berths.push(sideBerths);
    }
    return berths;
  };

  const handleSeatClick = (seatId: string, isBooked: boolean) => {
    if (isBooked) return;
    
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const lowerDeckSeats = createLowerDeckSeats();
  const upperDeckBerths = createUpperDeckBerths();
  
  return {
    lowerDeckSeats,
    upperDeckBerths,
    handleSeatClick
  };
};
