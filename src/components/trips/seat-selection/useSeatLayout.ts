
import { useState } from "react";

interface SeatLayoutData {
  rows: number;
  columns: number;
  aisle: number[];
  unavailableSeats: string[];
  sleeperBerths?: number;
  upperDeck?: boolean;
  layout?: string;
  type?: string;
}

export const useSeatLayout = (
  seatLayout: SeatLayoutData, 
  selectedSeats: string[], 
  setSelectedSeats: React.Dispatch<React.SetStateAction<string[]>>
) => {
  // Create data for the 1x2 lower deck seating arrangement with L/R notation
  const createLowerDeckSeats = () => {
    // If layout is specified as 2x2, create a 2x2 seating layout
    if (seatLayout.layout === "2x2") {
      return create2x2SeaterLayout();
    }
    
    // Default to 1x2 layout
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
  
  // Create data for the 2x2 seating layout
  const create2x2SeaterLayout = () => {
    const seats: ({ id: string; booked: boolean; selected: boolean })[][] = [];
    
    // Create 10 rows with 4 seats each (2 on left, 2 on right)
    for (let row = 1; row <= 10; row++) {
      const rowSeats: ({ id: string; booked: boolean; selected: boolean })[] = [];
      
      // Left side - two seats (L1-L20)
      const leftSeatId1 = `L${(row * 2) - 1}`;
      const isLeft1Booked = seatLayout.unavailableSeats.includes(leftSeatId1);
      const isLeft1Selected = selectedSeats.includes(leftSeatId1);
      
      rowSeats.push({
        id: leftSeatId1,
        booked: isLeft1Booked,
        selected: isLeft1Selected
      });
      
      const leftSeatId2 = `L${row * 2}`;
      const isLeft2Booked = seatLayout.unavailableSeats.includes(leftSeatId2);
      const isLeft2Selected = selectedSeats.includes(leftSeatId2);
      
      rowSeats.push({
        id: leftSeatId2,
        booked: isLeft2Booked,
        selected: isLeft2Selected
      });
      
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
    // If layout is 2x2 and type is sleeper, create 2x2 sleeper layout
    if (seatLayout.layout === "2x2" && seatLayout.type === "sleeper") {
      return create2x2SleeperLayout();
    }
    
    // Default to 1x2 sleeper layout
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
  
  // Create data for 2x2 sleeper layout with SL(a)/SL(b)/SR(a)/SR(b) notation
  const create2x2SleeperLayout = () => {
    const berths: ({ id: string; booked: boolean; selected: boolean })[][] = [];
    
    // Create left side sleepers with a/b notation (SL1(a), SL1(b), etc.)
    const leftSideBerths: ({ id: string; booked: boolean; selected: boolean })[] = [];
    for (let i = 1; i <= 5; i++) {
      // Add "a" berth
      const berthIdA = `SL${i}(a)`;
      const isBookedA = seatLayout.unavailableSeats.includes(berthIdA);
      const isSelectedA = selectedSeats.includes(berthIdA);
      
      leftSideBerths.push({
        id: berthIdA,
        booked: isBookedA,
        selected: isSelectedA
      });
      
      // Add "b" berth
      const berthIdB = `SL${i}(b)`;
      const isBookedB = seatLayout.unavailableSeats.includes(berthIdB);
      const isSelectedB = selectedSeats.includes(berthIdB);
      
      leftSideBerths.push({
        id: berthIdB,
        booked: isBookedB,
        selected: isSelectedB
      });
    }
    berths.push(leftSideBerths);
    
    // Create right side sleepers with a/b notation (SR1(a), SR1(b), etc.)
    const rightSideBerths: ({ id: string; booked: boolean; selected: boolean })[] = [];
    for (let i = 1; i <= 5; i++) {
      // Add "a" berth
      const berthIdA = `SR${i}(a)`;
      const isBookedA = seatLayout.unavailableSeats.includes(berthIdA);
      const isSelectedA = selectedSeats.includes(berthIdA);
      
      rightSideBerths.push({
        id: berthIdA,
        booked: isBookedA,
        selected: isSelectedA
      });
      
      // Add "b" berth
      const berthIdB = `SR${i}(b)`;
      const isBookedB = seatLayout.unavailableSeats.includes(berthIdB);
      const isSelectedB = selectedSeats.includes(berthIdB);
      
      rightSideBerths.push({
        id: berthIdB,
        booked: isBookedB,
        selected: isSelectedB
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
