
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck } from "lucide-react";
import { userService } from "@/services";

const AdminLoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("");
  const [debug, setDebug] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setDebug("");

    try {
      // First, check if it's a first-time setup for admin@example.com
      if (email === "admin@example.com") {
        setDebug("Checking if admin exists...");
        const { hasAdmin, error: checkError } = await userService.ensureAdminExists();
        
        if (checkError) {
          setDebug(prev => `${prev}\nError checking admin existence: ${checkError.message}`);
        } else if (!hasAdmin) {
          // This is first-time setup - create the admin user
          setDebug(prev => `${prev}\nNo admin users found. Creating first admin...`);
          
          try {
            await userService.createAdminUser(email, password);
            setDebug(prev => `${prev}\nAdmin user created successfully! Attempting login...`);
          } catch (setupError: any) {
            console.error("Admin setup error:", setupError);
            setDebug(prev => `${prev}\nSetup error: ${setupError.message}`);
            // Continue with login attempt even if setup fails
          }
        } else {
          setDebug(prev => `${prev}\nAdmin exists. Proceeding with login...`);
        }
      }

      // Sign in with email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) throw authError;

      // Debug info
      setDebug(prev => `${prev}\nUser authenticated. User ID: ${authData.user.id}`);
      console.log("Authenticated user:", authData.user);
      
      // Check if user has admin role using the service
      const isAdmin = await userService.checkAdminRole(authData.user.id);
      console.log("Admin role check result:", isAdmin);
      
      if (!isAdmin) {
        // If no admin role found but we're using admin@example.com, try to assign admin role
        if (email === "admin@example.com") {
          setDebug(prev => `${prev}\nNo admin role found. Attempting to assign admin role...`);
          await userService.createAdminUser(email, password);
          
          // Verify the role was added
          const roleVerified = await userService.checkAdminRole(authData.user.id);
          
          if (!roleVerified) {
            await supabase.auth.signOut();
            setDebug(prev => `${prev}\nFailed to assign admin role.`);
            throw new Error("Failed to assign admin role");
          }
          
          setDebug(prev => `${prev}\nAdmin role assigned successfully!`);
        } else {
          // For non-default admin emails, reject if no admin role
          await supabase.auth.signOut();
          setDebug(prev => `${prev}\nNo admin role found for this user.`);
          throw new Error("You are not authorized to access the admin panel");
        }
      }

      setDebug(prev => `${prev}\nAdmin role confirmed!`);
      toast.success("Admin login successful");
      
      // Set admin session flag in local storage to help distinguish admin logins
      localStorage.setItem("isAdminSession", "true");
      
      // Force a small delay to ensure local storage is set before navigation
      setTimeout(() => {
        navigate("/admin");
      }, 100);
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast.error(error.message);
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
