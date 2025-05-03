
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import type { User, Session } from "@supabase/supabase-js";
import { userService } from "@/services";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, redirectTo?: string) => Promise<void>;
  signUp: (email: string, password: string, redirectTo?: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user has admin role
  const checkAdminRole = async (userId: string) => {
    try {
      const hasAdminRole = await userService.checkAdminRole(userId);
      setIsAdmin(hasAdminRole);
      console.log("Admin role check result:", hasAdminRole);
      return hasAdminRole;
    } catch (error) {
      console.error("Error checking admin role:", error);
      setIsAdmin(false);
      return false;
    }
  };

  useEffect(() => {
    console.log("AuthContext initialized. Current path:", location.pathname);
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Check if user has admin role
          const isAdminUser = await checkAdminRole(session.user.id);
          console.log("Is admin user:", isAdminUser);
          
          // Check if the login originated from admin login page
          const isAdminSession = localStorage.getItem("isAdminSession") === "true";
          console.log("Is admin session:", isAdminSession);
          
          if (isAdminUser && isAdminSession) {
            console.log("Redirecting to admin dashboard");
            toast.success("Admin login successful!");
            navigate("/admin");
          } else if (!isAdminSession) {
            console.log("Redirecting to agent dashboard");
            toast.success("Logged in successfully!");
            navigate("/dashboard");
          }
        } else if (event === 'SIGNED_OUT') {
          localStorage.removeItem("isAdminSession");
          setIsAdmin(false);
          toast.info("Logged out successfully!");
          navigate("/");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user has admin role
        const isAdminUser = await checkAdminRole(session.user.id);
        console.log("Initial admin check result:", isAdminUser);
        
        // Check if we're on login page and should redirect
        const isAdminSession = localStorage.getItem("isAdminSession") === "true";
        console.log("Is stored admin session:", isAdminSession);
        
        if (location.pathname === '/login' && !isAdminSession) {
          navigate("/dashboard");
        } else if (location.pathname === '/admin-login' && isAdminUser && isAdminSession) {
          navigate("/admin");
        } else if (location.pathname.startsWith('/admin') && !isAdminUser) {
          // Redirect non-admin users away from admin pages
          toast.error("You don't have permission to access the admin panel");
          navigate("/dashboard");
        } else if (location.pathname.startsWith('/admin') && isAdminUser && !isAdminSession) {
          // Update the session flag if user is admin but the flag isn't set
          localStorage.setItem("isAdminSession", "true");
        }
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signIn = async (email: string, redirectTo?: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: redirectTo || window.location.origin
        }
      });
      
      if (error) throw error;
      
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      toast.error(`Login failed: ${error.message}`);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, redirectTo?: string, userData?: any) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo || window.location.origin,
          data: userData
        }
      });
      
      if (error) throw error;
      
      toast.success("Registration successful! Check your email for verification.");
    } catch (error: any) {
      toast.error(`Registration failed: ${error.message}`);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem("isAdminSession");
      await supabase.auth.signOut();
      navigate("/");
    } catch (error: any) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isAdmin, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
