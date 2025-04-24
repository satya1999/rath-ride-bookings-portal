
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

const AdminLoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [debug, setDebug] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setDebug("");

    try {
      // Sign in with email and password
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (authError) throw authError;

      // Debug info
      setDebug(`User authenticated. User ID: ${authData.user.id}`);
      console.log("Authenticated user:", authData.user);
      
      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id)
        .eq('role', 'admin')
        .single();
      
      if (roleError) {
        console.error("Role check error:", roleError);
        setDebug(prev => `${prev}\nRole check error: ${roleError.message}`);
      }
      
      if (!roleData) {
        // If no admin role found, sign them out
        await supabase.auth.signOut();
        setDebug(prev => `${prev}\nNo admin role found for this user.`);
        throw new Error("You are not authorized to access the admin panel");
      }

      toast.success("Admin login successful");
      navigate("/admin");
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
