
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Image } from "lucide-react";
import { TripPhoto } from "@/types/trip";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface TripPhotosTabProps {
  photos: TripPhoto[];
}

const TripPhotosTab = ({ photos }: TripPhotosTabProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center mb-6">
          <Image className="h-6 w-6 text-rath-red mr-2" />
          <h2 className="text-2xl font-bold">Trip Photos</h2>
        </div>
        
        <div className="mb-8">
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {photos.map((photo, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="p-0">
                        <AspectRatio ratio={16/9}>
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </AspectRatio>
                        <div className="p-4">
                          <h3 className="font-medium text-center">{photo.title}</h3>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div key={index} className="overflow-hidden rounded-lg">
              <img 
                src={photo.url} 
                alt={photo.title}
                className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
              />
              <p className="font-medium text-center mt-2">{photo.title}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TripPhotosTab;
