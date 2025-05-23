
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("agent@example.com");
  const [password, setPassword] = useState("agent123");
  const [activeTab, setActiveTab] = useState<string>("email");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Clear any admin session flag that might be present
      localStorage.removeItem("isAdminSession");
      
      // Use password-based authentication through our context
      const { success, error } = await signIn(email, password);
      
      if (!success) {
        throw new Error(error || "Login failed");
      }
      
      console.log("Login successful");
      
      // Redirect will happen automatically through the auth context
      toast.success("Login successful!");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(`Login failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This functionality is currently disabled
      toast.info("Magic link login is currently disabled");
      // await signIn(email);
      // navigate("/verify-otp");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleAdminLogin = () => {
    navigate("/admin-login");
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
        <div className="mb-6 bg-muted/50 p-4 rounded-lg">
          <div className="text-sm">
            <strong>Demo Agent Credentials</strong>
            <div className="mt-1 font-mono text-xs bg-background p-2 rounded border">
              Email: agent@example.com<br />
              Password: agent123
            </div>
          </div>
        </div>
      
        <Tabs defaultValue="email" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="email">Email & Password</TabsTrigger>
            <TabsTrigger value="magic">Magic Link</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="agent@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="magic">
            <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-magic">Email Address</Label>
                <Input
                  id="email-magic"
                  type="email"
                  placeholder="agent@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending Magic Link..." : "Send Magic Link"}
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
          onClick={handleAdminLogin}
        >
          Login as Admin
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="mt-2 text-center text-sm">
          Don't have an account?{" "}
          <button
            onClick={handleRegister}
            className="text-primary hover:underline font-medium"
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
