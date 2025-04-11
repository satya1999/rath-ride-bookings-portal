
import { useState } from "react";
import TripCard, { TripCardProps } from "./TripCard";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Sample data - in a real app, this would come from an API
const mockTrips: TripCardProps[] = [
  {
    id: "1",
    title: "Deluxe Trip to Puri",
    from: "Bhubaneswar",
    to: "Puri",
    date: new Date(2025, 3, 15),
    departureTime: "08:00 AM",
    fare: 2500,
    availableSeats: 32,
    totalSeats: 36,
    busType: "Seater",
  },
  {
    id: "2",
    title: "Premium Konark Tour",
    from: "Bhubaneswar",
    to: "Konark",
    date: new Date(2025, 3, 16),
    departureTime: "09:30 AM",
    fare: 3000,
    availableSeats: 18,
    totalSeats: 24,
    busType: "Mixed",
  },
  {
    id: "3",
    title: "Royal Chilika Lake Trip",
    from: "Bhubaneswar",
    to: "Chilika",
    date: new Date(2025, 3, 17),
    departureTime: "07:00 AM",
    fare: 3500,
    availableSeats: 12,
    totalSeats: 18,
    busType: "Sleeper",
  },
  {
    id: "4",
    title: "Explore Bhitarkanika",
    from: "Bhubaneswar",
    to: "Bhitarkanika",
    date: new Date(2025, 3, 18),
    departureTime: "06:30 AM",
    fare: 4000,
    availableSeats: 24,
    totalSeats: 36,
    busType: "Mixed",
  },
  {
    id: "5",
    title: "Scenic Daringbadi Tour",
    from: "Bhubaneswar",
    to: "Daringbadi",
    date: new Date(2025, 3, 20),
    departureTime: "10:00 PM",
    fare: 3200,
    availableSeats: 28,
    totalSeats: 36,
    busType: "Sleeper",
  },
  {
    id: "6",
    title: "Majestic Simlipal Trip",
    from: "Bhubaneswar",
    to: "Simlipal",
    date: new Date(2025, 3, 22),
    departureTime: "09:00 AM",
    fare: 3800,
    availableSeats: 16,
    totalSeats: 24,
    busType: "Seater",
  },
];

const TripList = () => {
  const [trips] = useState<TripCardProps[]>(mockTrips);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [busType, setBusType] = useState<string>("");

  // Filter trips based on search query, date and bus type
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = 
      trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.to.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDate = !selectedDate || trip.date.toDateString() === selectedDate.toDateString();
    
    const matchesBusType = !busType || trip.busType === busType;
    
    return matchesSearch && matchesDate && matchesBusType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search" className="mb-2 block">Search Trips</Label>
          <Input
            id="search"
            placeholder="Search by destination or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="w-full md:w-auto">
          <Label htmlFor="date-picker" className="mb-2 block">Travel Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-picker"
                variant={"outline"}
                className={cn(
                  "w-full md:w-auto justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="w-full md:w-auto">
          <Label htmlFor="bus-type" className="mb-2 block">Bus Type</Label>
          <Select value={busType} onValueChange={setBusType}>
            <SelectTrigger id="bus-type" className="w-full md:w-[180px]">
              <SelectValue placeholder="Any Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any Type</SelectItem>
              <SelectItem value="Seater">Seater</SelectItem>
              <SelectItem value="Sleeper">Sleeper</SelectItem>
              <SelectItem value="Mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard key={trip.id} {...trip} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2">No trips found</h3>
          <p className="text-gray-500">
            Try adjusting your search criteria or check back later for new trips.
          </p>
        </div>
      )}
    </div>
  );
};

export default TripList;
