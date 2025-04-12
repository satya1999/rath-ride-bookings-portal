
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
          .maybeSingle(); // Using maybeSingle instead of single to prevent errors when no record exists
          
        if (error && error.code !== 'PGRST116') {
          // Only throw if it's not the "no rows returned" error
          throw error;
        }
        
        // If data exists, set it. Otherwise, create a default profile object
        if (data) {
          setProfile(data);
        } else {
          console.log("No agent profile found, using default values");
          // Create a default profile with the current user's information
          setProfile({
            id: user.id,
            name: user.email?.split('@')[0] || "New Agent",
            email: user.email || "",
            phone: null,
            address: null,
            commission_rate: 10, // Default commission rate
            status: "pending", // Default status
            joined_at: new Date().toISOString()
          });
        }
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
      // Check if profile exists in database first
      const { data: existingProfile } = await supabase
        .from("agents")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();
        
      let result;
      
      if (existingProfile) {
        // Update existing profile
        result = await supabase
          .from("agents")
          .update(updates)
          .eq("id", user.id);
      } else {
        // Create new profile
        result = await supabase
          .from("agents")
          .insert({
            id: user.id,
            name: updates.name || profile.name,
            email: updates.email || profile.email,
            phone: updates.phone || profile.phone,
            address: updates.address || profile.address,
            commission_rate: updates.commission_rate || profile.commission_rate,
            status: updates.status || profile.status,
            joined_at: profile.joined_at
          });
      }
      
      if (result.error) throw result.error;
      
      // Update the local state
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
