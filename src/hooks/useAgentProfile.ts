
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface AgentProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  commission_rate: number;
  status: string;
  joined_at: string;
}

export function useAgentProfile() {
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchAgentProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("agents")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error fetching agent profile:", error);
        toast.error("Failed to load your profile");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAgentProfile();
  }, [user]);
  
  const updateProfile = async (updates: Partial<AgentProfile>) => {
    if (!user || !profile) return false;
    
    try {
      const { error } = await supabase
        .from("agents")
        .update(updates)
        .eq("id", user.id);
        
      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      toast.success("Profile updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      return false;
    }
  };
  
  return {
    profile,
    loading,
    updateProfile
  };
}
