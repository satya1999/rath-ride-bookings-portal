
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [activeTab, setActiveTab] = useState<string>("phone");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (activeTab === "email") {
        await signIn(phoneOrEmail);
      } else {
        // For phone, we would need to implement a different method
        // For now, we'll just show a message
        toast({
          title: "Phone login not implemented",
          description: "Please use email for now.",
          variant: "destructive",
        });
      }
      navigate("/verify-otp");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Login to your agent account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="phone" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="phone">Phone</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          
          <TabsContent value="phone">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  placeholder="+91 9876543210"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="email">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Admin Login</span>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => navigate("/admin-login")}
        >
          Login as Admin
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="mt-2 text-center text-sm">
          Don't have an account?{" "}
          <button
            onClick={handleRegister}
            className="text-rath-red hover:underline font-medium"
            type="button"
          >
            Register
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
