
import { useState } from "react";

interface SeatLayoutData {
  rows: number;
  columns: number;
  aisle: number[];
  unavailableSeats: string[];
  sleeperBerths?: number;
  upperDeck?: boolean;
}

export const useSeatLayout = (
  seatLayout: SeatLayoutData, 
  selectedSeats: string[], 
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>
) => {
  // Create data for the 1x2 lower deck seating arrangement with L/R notation
  const createLowerDeckSeats = () => {
    const seats: ({ id: string; booked: boolean; selected: boolean } | null)[][] = [];
    
    // Create 10 rows for the lower deck
    for (let row = 1; row <= 10; row++) {
      const rowSeats: ({ id: string; booked: boolean; selected: boolean } | null)[] = [];
      
      // Left side - single seat (L1-L10)
      const leftSeatId = `L${row}`;
      const isLeftBooked = seatLayout.unavailableSeats.includes(leftSeatId);
      const isLeftSelected = selectedSeats.includes(leftSeatId);
      
      rowSeats.push({
        id: leftSeatId,
        booked: isLeftBooked,
        selected: isLeftSelected
      });
      
      // Aisle
      rowSeats.push(null);
      
      // Right side - two seats (R1-R20)
      const rightSeatId1 = `R${(row * 2) - 1}`;
      const isRight1Booked = seatLayout.unavailableSeats.includes(rightSeatId1);
      const isRight1Selected = selectedSeats.includes(rightSeatId1);
      
      rowSeats.push({
        id: rightSeatId1,
        booked: isRight1Booked,
        selected: isRight1Selected
      });
      
      const rightSeatId2 = `R${row * 2}`;
      const isRight2Booked = seatLayout.unavailableSeats.includes(rightSeatId2);
      const isRight2Selected = selectedSeats.includes(rightSeatId2);
      
      rowSeats.push({
        id: rightSeatId2,
        booked: isRight2Booked,
        selected: isRight2Selected
      });
      
      seats.push(rowSeats);
    }
    
    return seats;
  };
  
  // Create data for the upper deck sleeper berths with SL/SR notation
  const createUpperDeckBerths = () => {
    const berths: ({ id: string; booked: boolean; selected: boolean })[][] = [];
    
    // Create left side sleepers (SL1-SL5)
    const leftSideBerths: ({ id: string; booked: boolean; selected: boolean })[] = [];
    for (let i = 1; i <= 5; i++) {
      const berthId = `SL${i}`;
      const isBooked = seatLayout.unavailableSeats.includes(berthId);
      const isSelected = selectedSeats.includes(berthId);
      
      leftSideBerths.push({
        id: berthId,
        booked: isBooked,
        selected: isSelected
      });
    }
    berths.push(leftSideBerths);
    
    // Create right side sleepers (SR1-SR10)
    const rightSideBerths: ({ id: string; booked: boolean; selected: boolean })[] = [];
    for (let i = 1; i <= 10; i++) {
      const berthId = `SR${i}`;
      const isBooked = seatLayout.unavailableSeats.includes(berthId);
      const isSelected = selectedSeats.includes(berthId);
      
      rightSideBerths.push({
        id: berthId,
        booked: isBooked,
        selected: isSelected
      });
    }
    berths.push(rightSideBerths);
    
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
