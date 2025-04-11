
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, IndianRupee, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface TripCardProps {
  id: string;
  title: string;
  from: string;
  to: string;
  date: Date;
  departureTime: string;
  fare: number;
  availableSeats: number;
  totalSeats: number;
  busType: "Seater" | "Sleeper" | "Mixed";
  imageUrl?: string;
  className?: string;
  description?: string;
}

const TripCard = ({
  id,
  title,
  from,
  to,
  date,
  departureTime,
  fare,
  availableSeats,
  totalSeats,
  busType,
  imageUrl = "https://source.unsplash.com/random/300x200/?bus",
  className,
  description
}: TripCardProps) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleViewDetails = () => {
    navigate(`/trips/${id}`);
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-shadow hover:shadow-lg cursor-pointer group",
        className
      )}
      onClick={handleViewDetails}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div 
          className="h-48 w-full bg-cover bg-center transition-transform duration-300"
          style={{ 
            backgroundImage: `url(${imageUrl})`,
            transform: isHovered ? "scale(1.05)" : "scale(1)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70" />
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <h3 className="font-bold text-xl truncate">{title}</h3>
          <div className="flex items-center text-white/90 text-sm mt-1">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{from} to {to}</span>
          </div>
        </div>
      </div>
      <CardContent className="pt-4">
        {description && (
          <p className="text-sm text-gray-600 mb-3">{description}</p>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
            <span>{format(date, "dd MMM yyyy")}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-gray-500" />
            <span>{departureTime}</span>
          </div>
          <div className="flex items-center text-sm">
            <IndianRupee className="h-4 w-4 mr-1 text-gray-500" />
            <span className="font-semibold">₹{fare.toLocaleString()}</span>
          </div>
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-1 text-gray-500" />
            <span>{availableSeats} / {totalSeats} seats</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {busType}
          </span>
          <Button 
            variant="default"
            className="transition-transform group-hover:scale-105"
            size="sm"
          >
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripCard;
