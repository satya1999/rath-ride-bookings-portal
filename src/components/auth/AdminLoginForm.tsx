import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ShieldCheck, Info } from "lucide-react";
import { userService } from "@/services";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const AdminLoginForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [debug, setDebug] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setDebug("Starting admin login process...");

    try {
      // First attempt to ensure admin user exists
      setDebug(prev => `${prev}\nEnsuring admin user exists...`);
      
      try {
        const result = await userService.createAdminUser(email, password);
        setDebug(prev => `${prev}\nAdmin setup: ${result.message}`);
      } catch (setupError: any) {
        setDebug(prev => `${prev}\nAdmin setup warning: ${setupError.message}`);
        // Continue with login attempt even if setup has issues
      }
      
      // Now log in with the credentials
      setDebug(prev => `${prev}\nAttempting to sign in...`);
      const { success, error } = await signIn(email, password);
      
      if (!success) {
        setDebug(prev => `${prev}\nLogin failed: ${error}`);
        throw new Error(error || "Login failed");
      }
      
      setDebug(prev => `${prev}\nLogin successful! Setting admin session flag...`);
      
      // Set admin session flag
      localStorage.setItem("isAdminSession", "true");
      
      // Verify admin role
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        throw new Error("Failed to retrieve user data after login");
      }
      
      setDebug(prev => `${prev}\nVerifying admin role...`);
      const isAdmin = await userService.checkAdminRole(user.id);
      
      if (!isAdmin) {
        setDebug(prev => `${prev}\nUser does not have admin role. Attempting to assign it...`);
        try {
          await userService.createAdminUser(email, password);
          setDebug(prev => `${prev}\nAdmin role assigned.`);
        } catch (roleError: any) {
          setDebug(prev => `${prev}\nError assigning admin role: ${roleError.message}`);
          throw new Error("Failed to assign admin role");
        }
      }
      
      toast.success("Admin login successful");
      setDebug(prev => `${prev}\nRedirecting to admin panel...`);
      navigate("/admin");
      
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast.error(`Login failed: ${error.message}`);
      
      // If there was an issue, ensure we're not in a half-authenticated state
      await supabase.auth.signOut();
      localStorage.removeItem("isAdminSession");
      
      setDebug(prev => `${prev}\nError: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-2">
          <ShieldCheck className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold text-center">Admin Access</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access the admin panel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-6 bg-muted/50">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="text-sm">
              <strong>Demo Admin Credentials</strong>
              <div className="mt-1 font-mono text-xs bg-background p-2 rounded border">
                Email: admin@example.com<br />
                Password: admin123
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
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
            {isLoading ? "Signing in..." : "Access Admin Panel"}
          </Button>
          
          {debug && (
            <div className="mt-4 p-3 bg-muted rounded-md text-xs font-mono overflow-auto max-h-32">
              <p className="font-semibold mb-1">Debug Info:</p>
              {debug.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="mt-2 text-center text-sm">
          <button
            onClick={handleBackToLogin}
            className="text-primary hover:underline font-medium"
            type="button"
          >
            Back to Agent Login
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AdminLoginForm;
