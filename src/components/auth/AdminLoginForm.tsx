
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, Info } from "lucide-react";
import { userService } from "@/services";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminLoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("admin123");
  const [debug, setDebug] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setDebug("Starting login process...");

    try {
      // First, try to create/ensure admin user exists
      setDebug(prev => `${prev}\nAttempting to ensure admin user exists...`);
      
      try {
        const result = await userService.createAdminUser(email, password);
        setDebug(prev => `${prev}\nAdmin user setup: ${result.message}`);
      } catch (setupError: any) {
        setDebug(prev => `${prev}\nAdmin setup error: ${setupError.message}`);
        // Continue with login attempt even if setup fails
      }
      
      // Now try to login with the credentials
      setDebug(prev => `${prev}\nAttempting to sign in...`);
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (loginError) {
        setDebug(prev => `${prev}\nLogin failed: ${loginError.message}`);
        throw loginError;
      }
      
      // Wait a bit to make sure roles are assigned
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify the user has admin role
      setDebug(prev => `${prev}\nVerifying admin role...`);
      const isAdmin = await userService.checkAdminRole(loginData.user.id);
      
      if (!isAdmin) {
        setDebug(prev => `${prev}\nUser does not have admin role. Attempting to assign it...`);
        try {
          await supabase.from('user_roles').upsert({
            user_id: loginData.user.id,
            role: 'admin'
          });
        } catch (roleError: any) {
          setDebug(prev => `${prev}\nError assigning admin role: ${roleError.message}`);
        }
      }
      
      setDebug(prev => `${prev}\nAuthenticated successfully!`);
      
      // Set admin session flag in local storage
      localStorage.setItem("isAdminSession", "true");
      
      toast.success("Admin login successful");
      setDebug(prev => `${prev}\nRedirecting to admin panel...`);
      navigate("/admin");
      
    } catch (error: any) {
      console.error("Admin login error:", error);
      toast.error(`Login failed: ${error.message}`);
      setDebug(prev => `${prev}\nError: ${error.message}`);
      
      // If there was an issue, ensure we're not in a half-authenticated state
      await supabase.auth.signOut();
      
      // Special handling for "Invalid login credentials"
      if (error.message === "Invalid login credentials") {
        setDebug(prev => `${prev}\nAttempting one more admin creation try...`);
        try {
          // Try to create the admin user with a different approach
          const { data } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true
          });
          
          if (data?.user) {
            setDebug(prev => `${prev}\nAdmin account created via admin API. Try logging in again.`);
            toast.info("Admin account created. Please try logging in again.");
          }
        } catch (signUpError: any) {
          setDebug(prev => `${prev}\nAdmin account creation error: ${signUpError.message}`);
        }
      }
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
