
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const OtpVerification = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Here you would typically verify the OTP with your auth service
    // For now, we'll just simulate a successful verification
    try {
      setTimeout(() => {
        // Mock successful verification
        toast({
          title: "Verification successful!",
          description: "You are now logged in.",
        });
        navigate("/dashboard");
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Verification failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResend = () => {
    setTimeLeft(60);
    toast({
      title: "OTP Resent!",
      description: "Check your phone for the new OTP.",
    });
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Verify OTP</CardTitle>
        <CardDescription className="text-center">
          Enter the verification code sent to your phone
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="otp"
              placeholder="Enter OTP"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center text-xl tracking-widest"
              maxLength={6}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
          
          <div className="text-center">
            {timeLeft > 0 ? (
              <p className="text-sm text-gray-500">
                Resend OTP in {timeLeft} seconds
              </p>
            ) : (
              <Button 
                variant="link" 
                onClick={handleResend}
                className="text-sm p-0 h-auto"
              >
                Resend OTP
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OtpVerification;
