
import React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SeatLegend from "./SeatLegend";
import LowerDeckSeats from "./LowerDeckSeats";
import UpperDeckBerths from "./UpperDeckBerths";
import Seater2x2Layout from "./Seater2x2Layout";
import Sleeper2x2Layout from "./Sleeper2x2Layout";
import { useIsMobile } from "@/hooks/use-mobile";

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

interface SeatSelectionContentProps {
  selectedSeats: string[];
  lowerDeckSeats: ({ id: string; booked: boolean; selected: boolean } | null)[][];
  upperDeckBerths: ({ id: string; booked: boolean; selected: boolean })[][];
  handleSeatClick: (seatId: string, isBooked: boolean) => void;
  handleProceedToPassengerDetails: () => void;
  onSaveLayout?: () => void;
  layoutType?: string;
}

type DeckType = "lower" | "upper";

const SeatSelectionContent = ({
  selectedSeats,
  lowerDeckSeats,
  upperDeckBerths,
  handleSeatClick,
  handleProceedToPassengerDetails,
  onSaveLayout,
  layoutType = "1x2" // Default to 1x2 if not specified
}: SeatSelectionContentProps) => {
  const [activeDeck, setActiveDeck] = React.useState<DeckType>("lower");
  const isMobile = useIsMobile();
  
  const renderLowerDeckLayout = () => {
    if (layoutType === "2x2") {
      return (
        <Seater2x2Layout 
          seats={lowerDeckSeats.map(row => row.filter(seat => seat !== null) as ({ id: string; booked: boolean; selected: boolean })[])} 
          onSeatClick={handleSeatClick} 
        />
      );
    }
    
    // Default to 1x2 layout
    return <LowerDeckSeats seats={lowerDeckSeats} onSeatClick={handleSeatClick} />;
  };
  
  const renderUpperDeckLayout = () => {
    if (layoutType === "2x2") {
      return (
        <Sleeper2x2Layout 
          berths={upperDeckBerths} 
          onBerthClick={handleSeatClick} 
        />
      );
    }
    
    // Default to 1x2 layout
    return (
      <UpperDeckBerths 
        berths={upperDeckBerths} 
        onBerthClick={handleSeatClick} 
        onSaveLayout={onSaveLayout} 
      />
    );
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Select Seats</h2>
      <p className="text-gray-600 mb-6">
        Click on a seat to select it for booking. You'll need to pay ₹2,000 per seat as minimum advance.
      </p>
      
      <SeatLegend />
      
      <Tabs value={activeDeck} onValueChange={(value) => setActiveDeck(value as DeckType)} className="w-full mb-6">
        <TabsList className={`grid ${isMobile ? "w-full" : "w-[400px]"} grid-cols-2 mx-auto`}>
          <TabsTrigger value="lower" className="text-xs sm:text-sm">
            Lower Deck ({layoutType === "2x2" ? "2×2" : "1×2"})
          </TabsTrigger>
          <TabsTrigger value="upper" className="text-xs sm:text-sm">
            Upper Deck ({layoutType === "2x2" ? "2×2 Sleeper" : "Sleeper"})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="lower">
          {renderLowerDeckLayout()}
        </TabsContent>
        
        <TabsContent value="upper">
          {renderUpperDeckLayout()}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-center">
        <Button 
          onClick={handleProceedToPassengerDetails} 
          className="px-8" 
          disabled={selectedSeats.length === 0}
        >
          Continue with {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
        </Button>
      </div>
    </>
  );
};

export default SeatSelectionContent;
