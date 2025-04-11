
import React from "react";
import { MapPin } from "lucide-react";

interface TripHeroProps {
  imageUrl: string;
  title: string;
  from: string;
  to: string;
}

const TripHero = ({ imageUrl, title, from, to }: TripHeroProps) => {
  return (
    <div className="relative h-72 rounded-lg overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h1 className="font-bold text-3xl">{title}</h1>
        <div className="flex items-center mt-2">
          <MapPin className="h-5 w-5 mr-1" />
          <span className="text-lg">
            {from} to {to}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripHero;
