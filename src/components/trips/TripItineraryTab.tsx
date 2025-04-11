
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Itinerary } from "@/types/trip";

interface TripItineraryTabProps {
  itinerary: Itinerary[];
}

const TripItineraryTab = ({ itinerary }: TripItineraryTabProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center mb-6">
          <FileText className="h-6 w-6 text-rath-red mr-2" />
          <h2 className="text-2xl font-bold">Day by Day Itinerary</h2>
        </div>
        
        <div className="space-y-6">
          {itinerary.map((day, index) => (
            <div key={index} className="relative pl-8 before:absolute before:left-3 before:top-0 before:bottom-0 before:w-0.5 before:bg-gray-200">
              <div className="absolute left-0 top-1 flex items-center justify-center w-6 h-6 rounded-full bg-rath-red text-white text-sm font-bold">
                {day.day}
              </div>
              <div className="border-l-4 border-rath-red pl-4 py-2">
                <h3 className="font-bold text-lg">{day.title}</h3>
                <p className="text-gray-600 mt-1">{day.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TripItineraryTab;
