
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Passenger } from "@/types/trip";
import { User, Phone, Droplets, CalendarDays, IndianRupee, CreditCard } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import DocumentUpload from "./DocumentUpload";

// Form validation schema
const passengerFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  mobile: z.string().regex(/^[6-9]\d{9}$/, { message: "Enter a valid 10-digit Indian mobile number" }),
  age: z.coerce.number().int().min(1).max(120),
  bloodGroup: z.string().optional(),
  seatNumber: z.string(),
  advanceAmount: z.coerce.number().int().min(2000, { message: "Advance amount must be at least ₹2,000" })
});

interface PassengerFormFieldsProps {
  onSubmit: (data: Passenger) => void;
  onPrevious?: () => void;
  seatNumber: string;
  isLastPassenger: boolean;
  initialValues?: Partial<Passenger>;
}

const PassengerFormFields = ({ 
  onSubmit, 
  onPrevious, 
  seatNumber,
  isLastPassenger,
  initialValues
}: PassengerFormFieldsProps) => {
  const { toast } = useToast();
  const [aadharFront, setAadharFront] = useState<File | null>(initialValues?.aadharFront || null);
  const [aadharBack, setAadharBack] = useState<File | null>(initialValues?.aadharBack || null);
  
  const form = useForm<z.infer<typeof passengerFormSchema>>({
    resolver: zodResolver(passengerFormSchema),
    defaultValues: {
      name: initialValues?.name || "",
      mobile: initialValues?.mobile || "",
      age: initialValues?.age || undefined,
      bloodGroup: initialValues?.bloodGroup || "",
      seatNumber: seatNumber,
      advanceAmount: initialValues?.advanceAmount || 2000
    }
  });

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleFormSubmit = (values: z.infer<typeof passengerFormSchema>) => {
    if (!aadharFront || !aadharBack) {
      toast({
        title: "Missing document",
        description: !aadharFront 
          ? "Please upload front side of Aadhar card" 
          : "Please upload back side of Aadhar card",
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

    onSubmit(passengerData);
  };

  const handleFileChange = (type: 'front' | 'back', file: File) => {
    if (type === 'front') {
      setAadharFront(file);
    } else {
      setAadharBack(file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
        <DocumentUpload 
          onFileChange={handleFileChange}
          aadharFront={aadharFront}
          aadharBack={aadharBack}
        />

        <div className="flex justify-between items-center">
          <div>
            {onPrevious && (
              <Button 
                type="button" 
                variant="outline"
                onClick={onPrevious}
              >
                Previous Passenger
              </Button>
            )}
          </div>
          <Button type="submit" className="flex items-center gap-2">
            {!isLastPassenger ? (
              <>Next Passenger</>
            ) : (
              <><CreditCard className="h-4 w-4" /> Proceed to Payment</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PassengerFormFields;
