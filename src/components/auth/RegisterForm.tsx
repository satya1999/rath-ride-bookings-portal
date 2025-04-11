
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    aadhaar: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Here you would typically integrate with an auth service
    // For now, we'll just simulate the registration
    try {
      setTimeout(() => {
        // Mock successful registration
        toast({
          title: "Registration successful!",
          description: "Verification OTP has been sent to your phone.",
        });
        navigate("/verify-otp");
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Registration failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Register as Agent</CardTitle>
        <CardDescription className="text-center">
          Create an account to start booking tickets
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              required
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 9876543210"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="aadhaar">Aadhaar Number (Optional)</Label>
            <Input
              id="aadhaar"
              name="aadhaar"
              placeholder="XXXX XXXX XXXX"
              value={formData.aadhaar}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500">Providing Aadhaar helps in faster verification.</p>
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="mt-2 text-center text-sm">
          Already have an account?{" "}
          <button
            onClick={handleLogin}
            className="text-rath-red hover:underline font-medium"
            type="button"
          >
            Login
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
