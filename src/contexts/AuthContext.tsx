
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, redirectTo?: string) => Promise<void>;
  signUp: (email: string, password: string, redirectTo?: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (event === 'SIGNED_IN') {
          toast.success("Logged in successfully!");
        } else if (event === 'SIGNED_OUT') {
          toast.info("Logged out successfully!");
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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
      await supabase.auth.signOut();
      navigate("/");
    } catch (error: any) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, signIn, signUp, signOut }}>
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
