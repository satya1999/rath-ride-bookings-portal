
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PassengerTabsProps {
  passengers: number[];
  currentPassengerIndex: number;
  onChange: (index: number) => void;
  completedIndices: number[];
  selectedSeats: string[];
}

const PassengerTabs = ({ 
  passengers, 
  currentPassengerIndex, 
  onChange, 
  completedIndices,
  selectedSeats
}: PassengerTabsProps) => {
  // Generate passenger tabs
  const passengerTabs = passengers.map((_, index) => ({
    value: index.toString(),
    label: `Passenger ${index + 1} - Seat ${selectedSeats[index]}`
  }));

  return (
    <Tabs 
      value={currentPassengerIndex.toString()} 
      onValueChange={(value) => {
        // Only allow changing to completed passenger tabs or current one
        const tabIndex = parseInt(value);
        if (tabIndex <= completedIndices.length) {
          onChange(tabIndex);
        }
      }}
    >
      <TabsList className="mb-4 flex overflow-x-auto max-w-full">
        {passengerTabs.map((tab) => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value}
            className="whitespace-nowrap"
            disabled={parseInt(tab.value) > completedIndices.length}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default PassengerTabs;
