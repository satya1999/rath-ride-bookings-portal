
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Passenger } from "@/types/trip";
import { IndianRupee, CreditCard, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface PaymentGatewayProps {
  passengers: Passenger[];
  fare: number;
  onPaymentSuccess: () => void;
  tripId: string; // Add trip ID prop
  selectedSeats: string[]; // Add selected seats prop
}

const PaymentGateway = ({ passengers, fare, onPaymentSuccess, tripId, selectedSeats }: PaymentGatewayProps) => {
  const { toast: useToastHook } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Generate booking number
      const bookingNumber = `BK${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Calculate total trip fare
      const totalTripFare = passengers.reduce((sum, passenger) => sum + 24500, 0);
      
      // Prepare booking data
      const bookingData = {
        booking_number: bookingNumber,
        user_id: user?.id || '',
        agent_id: user?.id || '', // Assuming the current user is an agent
        trip_id: tripId,
        seats: selectedSeats,
        passengers: passengers,
        total_amount: totalTripFare,
        status: 'confirmed'
      };

      // Save booking to database
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData);
      
      if (error) {
        console.error('Booking error:', error);
        throw error;
      }
      
      // Simulate successful payment
      setTimeout(() => {
        setIsProcessing(false);
        
        toast.success("Payment Successful!", {
          description: `₹${fare} has been successfully paid.`
        });
        
        onPaymentSuccess();
      }, 2000);
      
    } catch (error) {
      console.error("Payment error:", error);
      setIsProcessing(false);
      toast.error("Payment failed", { 
        description: "There was an error processing your payment. Please try again." 
      });
    }
  };

  // Calculate total trip fare (to show balance)
  const totalTripFare = passengers.reduce((sum, passenger) => sum + 24500, 0);
  const balanceDue = totalTripFare - fare;

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>
        
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Booking Summary</h3>
            <div>
              <h4 className="font-medium mb-2">Passenger Details</h4>
              <div className="space-y-3 mb-4">
                {passengers.map((passenger, index) => (
                  <div key={index} className="border-b border-gray-200 pb-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Passenger {index + 1}</span>
                      <span className="font-medium">{passenger.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Seat</span>
                      <span className="font-medium">{passenger.seatNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Advance</span>
                      <span className="font-medium">₹{passenger.advanceAmount || 2000}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Fare</span>
                <span className="font-medium">₹{totalTripFare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Advance Payment</span>
                <span className="font-medium">₹{fare}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Balance Due (on boarding)</span>
                <span className="font-medium">₹{balanceDue}</span>
              </div>
              <div className="border-t border-gray-200 my-2"></div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-semibold">Amount to Pay Now</span>
                <span className="font-bold">₹{fare}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Select Payment Method</h3>
            <div className="space-y-4">
              <div className="flex items-center p-3 border border-green-500 rounded-lg bg-green-50">
                <input 
                  type="radio" 
                  id="phonepe" 
                  name="payment-method" 
                  className="h-4 w-4 text-green-600"
                  checked
                  readOnly
                />
                <label htmlFor="phonepe" className="ml-3 flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center bg-purple-600 rounded-full text-white">
                    <IndianRupee className="h-5 w-5" />
                  </div>
                  <span className="font-medium">PhonePe</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              onClick={handlePayment} 
              disabled={isProcessing}
              className="px-6 py-5 text-base bg-purple-600 hover:bg-purple-700"
            >
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay Now ₹{fare}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentGateway;
