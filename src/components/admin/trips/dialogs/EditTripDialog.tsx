
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, X, Image } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Trip, Itinerary } from "@/types/trip";

const tripSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  from: z.string().min(2, "Source location is required"),
  to: z.string().min(2, "Destination is required"),
  date: z.date(),
  departureTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  arrivalTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
  fare: z.coerce.number().min(1, "Fare must be greater than 0"),
});

type TripFormValues = z.infer<typeof tripSchema>;

interface EditTripDialogProps {
  trip: Trip;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Trip>) => void;
  onUploadImage: (file: File, title: string) => void;
  onUpdateDetails: (description: string, itinerary: Itinerary[], amenities: string[]) => void;
}

const EditTripDialog = ({ 
  trip, 
  open, 
  onOpenChange, 
  onSubmit, 
  onUploadImage, 
  onUpdateDetails 
}: EditTripDialogProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [description, setDescription] = useState(trip.description || "");
  const [amenities, setAmenities] = useState<string[]>(trip.amenities || []);
  const [newAmenity, setNewAmenity] = useState("");
  const [itinerary, setItinerary] = useState<Itinerary[]>(trip.itinerary || []);
  const [newItineraryItem, setNewItineraryItem] = useState({ day: 1, title: "", description: "" });
  const [imageTitle, setImageTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<TripFormValues>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      title: trip.title,
      from: trip.from,
      to: trip.to,
      date: trip.date,
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      fare: trip.fare,
    },
  });

  const handleSubmit = (values: TripFormValues) => {
    onSubmit({
      title: values.title,
      from: values.from,
      to: values.to,
      date: values.date,
      departureTime: values.departureTime,
      arrivalTime: values.arrivalTime,
      fare: values.fare,
    });
  };

  const handleUpdateDetails = () => {
    onUpdateDetails(description, itinerary, amenities);
  };

  const handleAddAmenity = () => {
    if (newAmenity && !amenities.includes(newAmenity)) {
      setAmenities([...amenities, newAmenity]);
      setNewAmenity("");
    }
  };

  const handleRemoveAmenity = (index: number) => {
    setAmenities(amenities.filter((_, i) => i !== index));
  };

  const handleAddItineraryItem = () => {
    if (newItineraryItem.title && newItineraryItem.description) {
      setItinerary([...itinerary, newItineraryItem]);
      setNewItineraryItem({ day: newItineraryItem.day + 1, title: "", description: "" });
    }
  };

  const handleRemoveItineraryItem = (index: number) => {
    setItinerary(itinerary.filter((_, i) => i !== index));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadImage = () => {
    if (selectedFile && imageTitle) {
      onUploadImage(selectedFile, imageTitle);
      setSelectedFile(null);
      setImageTitle("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Trip: {trip.title}</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Trip Details</TabsTrigger>
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="py-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trip Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter trip title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From</FormLabel>
                        <FormControl>
                          <Input placeholder="Source location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To</FormLabel>
                        <FormControl>
                          <Input placeholder="Destination" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Departure Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="departureTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departure Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="arrivalTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Arrival Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="fare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base Fare (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" step="100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full">Save Basic Info</Button>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="details" className="py-4 space-y-4">
            <div>
              <FormLabel>Description</FormLabel>
              <Textarea 
                placeholder="Enter trip description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="min-h-32"
              />
            </div>
            
            <div>
              <FormLabel>Amenities</FormLabel>
              <div className="flex flex-wrap gap-2 mb-2">
                {amenities.map((amenity, index) => (
                  <div 
                    key={index} 
                    className="bg-muted rounded-full py-1 px-3 flex items-center gap-1 text-sm"
                  >
                    <span>{amenity}</span>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5" 
                      onClick={() => handleRemoveAmenity(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add amenity" 
                  value={newAmenity} 
                  onChange={(e) => setNewAmenity(e.target.value)}
                />
                <Button type="button" onClick={handleAddAmenity}>Add</Button>
              </div>
            </div>
            
            <Button type="button" onClick={handleUpdateDetails} className="w-full">Save Details</Button>
          </TabsContent>
          
          <TabsContent value="itinerary" className="py-4 space-y-4">
            <div className="space-y-4">
              {itinerary.map((item, index) => (
                <div key={index} className="border rounded-md p-4 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => handleRemoveItineraryItem(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="font-medium">Day {item.day}: {item.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                </div>
              ))}
            </div>
            
            <div className="border rounded-md p-4 space-y-3">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <FormLabel>Day</FormLabel>
                  <Input
                    type="number"
                    min="1"
                    value={newItineraryItem.day}
                    onChange={(e) => setNewItineraryItem({ 
                      ...newItineraryItem, 
                      day: parseInt(e.target.value) || 1 
                    })}
                  />
                </div>
                <div className="col-span-3">
                  <FormLabel>Title</FormLabel>
                  <Input
                    placeholder="Day title"
                    value={newItineraryItem.title}
                    onChange={(e) => setNewItineraryItem({ 
                      ...newItineraryItem, 
                      title: e.target.value 
                    })}
                  />
                </div>
              </div>
              <div>
                <FormLabel>Description</FormLabel>
                <Textarea
                  placeholder="Day description"
                  value={newItineraryItem.description}
                  onChange={(e) => setNewItineraryItem({ 
                    ...newItineraryItem, 
                    description: e.target.value 
                  })}
                />
              </div>
              <Button 
                type="button" 
                onClick={handleAddItineraryItem}
                disabled={!newItineraryItem.title || !newItineraryItem.description}
                className="w-full"
              >
                Add Day
              </Button>
            </div>
            
            <Button type="button" onClick={handleUpdateDetails} className="w-full">Save Itinerary</Button>
          </TabsContent>
          
          <TabsContent value="photos" className="py-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {trip.photos && trip.photos.map((photo, index) => (
                <div key={index} className="aspect-square rounded-md overflow-hidden relative">
                  <img 
                    src={photo.url} 
                    alt={photo.title} 
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                    <p className="text-white text-xs truncate">{photo.title}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border rounded-md p-4 space-y-3">
              <div className="space-y-2">
                <FormLabel>Upload Image</FormLabel>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </div>
              <div>
                <FormLabel>Image Title</FormLabel>
                <Input
                  placeholder="Image title"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                />
              </div>
              <Button 
                type="button" 
                onClick={handleUploadImage}
                disabled={!selectedFile || !imageTitle}
                className="w-full"
              >
                <Image className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditTripDialog;
