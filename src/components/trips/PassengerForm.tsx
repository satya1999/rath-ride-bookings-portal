
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Passenger } from "@/types/trip";
import { User, Phone, Droplets, CalendarDays, Upload, CreditCard, IndianRupee } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Form validation schema
const passengerFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  mobile: z.string().regex(/^[6-9]\d{9}$/, { message: "Enter a valid 10-digit Indian mobile number" }),
  age: z.coerce.number().int().min(1).max(120),
  bloodGroup: z.string().optional(),
  seatNumber: z.string(),
  advanceAmount: z.coerce.number().int().min(2000, { message: "Advance amount must be at least ₹2,000" })
});

interface PassengerFormProps {
  selectedSeats: string[];
  onSubmit: (data: Passenger[]) => void;
}

const PassengerForm = ({ selectedSeats, onSubmit }: PassengerFormProps) => {
  const { toast } = useToast();
  const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [aadharFront, setAadharFront] = useState<File | null>(null);
  const [aadharBack, setAadharBack] = useState<File | null>(null);
  
  const form = useForm<z.infer<typeof passengerFormSchema>>({
    resolver: zodResolver(passengerFormSchema),
    defaultValues: {
      name: "",
      mobile: "",
      age: undefined,
      bloodGroup: "",
      seatNumber: selectedSeats[currentPassengerIndex] || "",
      advanceAmount: 2000
    }
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleSubmit = (values: z.infer<typeof passengerFormSchema>) => {
    if (!aadharFront) {
      toast({
        title: "Missing document",
        description: "Please upload front side of Aadhar card",
        variant: "destructive",
      });
      return;
    }

    if (!aadharBack) {
      toast({
        title: "Missing document",
        description: "Please upload back side of Aadhar card",
        variant: "destructive",
      });
      return;
    }

    // Create passenger data
    const passengerData: Passenger = {
      name: values.name,
      mobile: values.mobile,
      age: values.age,
      bloodGroup: values.bloodGroup,
      seatNumber: values.seatNumber,
      aadharFront,
      aadharBack,
      advanceAmount: values.advanceAmount
    };

    if (currentPassengerIndex < selectedSeats.length - 1) {
      // Add current passenger and move to next seat
      setPassengers([...passengers, passengerData]);
      setCurrentPassengerIndex(currentPassengerIndex + 1);
      setAadharFront(null);
      setAadharBack(null);
      
      // Reset form for next passenger
      form.reset({
        name: "",
        mobile: "",
        age: undefined,
        bloodGroup: "",
        seatNumber: selectedSeats[currentPassengerIndex + 1],
        advanceAmount: values.advanceAmount // Keep the same advance amount
      });
      
      toast({
        title: "Passenger added",
        description: `Passenger ${currentPassengerIndex + 1} details saved. Please enter details for Passenger ${currentPassengerIndex + 2}.`,
      });
    } else {
      // Submit all passengers' data
      const allPassengers = [...passengers, passengerData];
      onSubmit(allPassengers);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'front') {
        setAadharFront(e.target.files[0]);
      } else {
        setAadharBack(e.target.files[0]);
      }
    }
  };

  // Generate passenger tabs
  const passengerTabs = selectedSeats.map((_, index) => ({
    value: index.toString(),
    label: `Passenger ${index + 1} - Seat ${selectedSeats[index]}`
  }));

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-6">Passenger Details</h2>
        {selectedSeats.length > 1 && (
          <div className="mb-6">
            <Tabs value={currentPassengerIndex.toString()} onValueChange={(value) => {
              // Only allow changing to completed passenger tabs or current one
              const tabIndex = parseInt(value);
              if (tabIndex <= passengers.length) {
                setCurrentPassengerIndex(tabIndex);
                if (tabIndex < passengers.length) {
                  // Load saved data for this passenger
                  const passenger = passengers[tabIndex];
                  form.reset({
                    name: passenger.name,
                    mobile: passenger.mobile,
                    age: passenger.age,
                    bloodGroup: passenger.bloodGroup || "",
                    seatNumber: passenger.seatNumber,
                    advanceAmount: passenger.advanceAmount || 2000
                  });
                  setAadharFront(passenger.aadharFront);
                  setAadharBack(passenger.aadharBack);
                }
              }
            }}>
              <TabsList className="mb-4 flex overflow-x-auto max-w-full">
                {passengerTabs.map((tab) => (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value}
                    className="whitespace-nowrap"
                    disabled={parseInt(tab.value) > passengers.length}
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4" /> Full Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter passenger's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mobile field */}
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4" /> Mobile Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="10-digit mobile number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Age field */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" /> Age
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter age"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Blood Group field */}
              <FormField
                control={form.control}
                name="bloodGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Droplets className="h-4 w-4" /> Blood Group (Optional)
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bloodGroups.map((bloodGroup) => (
                          <SelectItem key={bloodGroup} value={bloodGroup}>
                            {bloodGroup}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Seat Number field */}
              <FormField
                control={form.control}
                name="seatNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seat Number</FormLabel>
                    <FormControl>
                      <Input value={field.value} readOnly className="bg-gray-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Advance Amount field */}
              <FormField
                control={form.control}
                name="advanceAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4" /> Advance Amount
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={2000}
                        placeholder="Minimum ₹2,000"
                        {...field}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500">
                      Minimum advance: ₹2,000. Balance will be collected on boarding day.
                    </p>
                  </FormItem>
                )}
              />
            </div>

            {/* Aadhar Card Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Identity Verification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Aadhar Card Front
                  </FormLabel>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'front')}
                    />
                    {aadharFront && <span className="text-green-600 text-sm">Uploaded</span>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <FormLabel className="flex items-center gap-2">
                    <Upload className="h-4 w-4" /> Aadhar Card Back
                  </FormLabel>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'back')}
                    />
                    {aadharBack && <span className="text-green-600 text-sm">Uploaded</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                {currentPassengerIndex > 0 && (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => {
                      setCurrentPassengerIndex(currentPassengerIndex - 1);
                      const prevPassenger = passengers[currentPassengerIndex - 1];
                      form.reset({
                        name: prevPassenger.name,
                        mobile: prevPassenger.mobile,
                        age: prevPassenger.age,
                        bloodGroup: prevPassenger.bloodGroup || "",
                        seatNumber: prevPassenger.seatNumber,
                        advanceAmount: prevPassenger.advanceAmount || 2000
                      });
                      setAadharFront(prevPassenger.aadharFront);
                      setAadharBack(prevPassenger.aadharBack);
                    }}
                  >
                    Previous Passenger
                  </Button>
                )}
              </div>
              <Button type="submit" className="flex items-center gap-2">
                {currentPassengerIndex < selectedSeats.length - 1 ? (
                  <>Next Passenger</>
                ) : (
                  <><CreditCard className="h-4 w-4" /> Proceed to Payment</>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PassengerForm;
