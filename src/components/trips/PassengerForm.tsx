
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
import { User, Phone, Droplets, CalendarDays, Upload, CreditCard } from "lucide-react";

// Form validation schema
const passengerFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  mobile: z.string().regex(/^[6-9]\d{9}$/, { message: "Enter a valid 10-digit Indian mobile number" }),
  age: z.coerce.number().int().min(1).max(120),
  bloodGroup: z.string().optional(),
  seatNumber: z.string()
});

interface PassengerFormProps {
  selectedSeats: string[];
  onSubmit: (data: Passenger) => void;
}

const PassengerForm = ({ selectedSeats, onSubmit }: PassengerFormProps) => {
  const { toast } = useToast();
  const [aadharFront, setAadharFront] = useState<File | null>(null);
  const [aadharBack, setAadharBack] = useState<File | null>(null);
  
  const form = useForm<z.infer<typeof passengerFormSchema>>({
    resolver: zodResolver(passengerFormSchema),
    defaultValues: {
      name: "",
      mobile: "",
      age: undefined,
      bloodGroup: "",
      seatNumber: selectedSeats[0] || ""
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

    // Make sure all required fields from Passenger type are included
    const passengerData: Passenger = {
      name: values.name,
      mobile: values.mobile,
      age: values.age,
      bloodGroup: values.bloodGroup,
      seatNumber: values.seatNumber,
      aadharFront,
      aadharBack,
    };

    onSubmit(passengerData);
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

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-6">Passenger Details</h2>
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

            <div className="flex justify-end">
              <Button type="submit" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Proceed to Payment
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PassengerForm;
