
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
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

    try {
      // Create user profile data
      const userData = {
        name: formData.name,
        phone: formData.phone,
        aadhaar: formData.aadhaar
      };

      await signUp(
        formData.email,
        formData.password,
        undefined, // use default redirect
        userData
      );
      
      navigate("/verify-otp");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              value={formData.password}
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
