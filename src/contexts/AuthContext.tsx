
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
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
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
        
        if (session) {
          console.log("Session found in auth state change:", session.user.email);
          setSession(session);
          setUser(session.user);
          
          // Check if user has admin role
          if (session.user) {
            const isAdminUser = await checkAdminRole(session.user.id);
            
            // Check if the login originated from admin login page
            const isAdminSession = localStorage.getItem("isAdminSession") === "true";
            console.log("Is admin session:", isAdminSession);
            
            if (isAdminUser && isAdminSession && event === 'SIGNED_IN') {
              console.log("Admin logged in, redirecting to admin dashboard");
              toast.success("Admin login successful!");
              navigate("/admin");
            } else if (!isAdminSession && event === 'SIGNED_IN') {
              console.log("Agent logged in, redirecting to dashboard");
              toast.success("Logged in successfully!");
              navigate("/dashboard");
            }
          }
        } else {
          console.log("No session in auth state change");
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          
          if (event === 'SIGNED_OUT') {
            localStorage.removeItem("isAdminSession");
            toast.info("Logged out successfully!");
            navigate("/");
          }
        }
      }
    );

    // THEN check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session?.user?.email);
        
        if (session) {
          setSession(session);
          setUser(session.user);
          
          if (session.user) {
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
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error.message);
        toast.error(`Login failed: ${error.message}`);
        return { success: false, error: error.message };
      }
      
      console.log("Sign in successful:", data.user?.email);
      return { success: true };
    } catch (error: any) {
      console.error("Login exception:", error);
      toast.error(`Login failed: ${error.message}`);
      return { success: false, error: error.message };
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
      setUser(null);
      setSession(null);
      setIsAdmin(false);
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
