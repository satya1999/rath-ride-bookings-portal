
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Json } from "@/integrations/supabase/types";

// Agent Service
export const agentService = {
  getAgents: async () => {
    try {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("name");
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Failed to fetch agents");
      return [];
    }
  },
  
  updateAgentStatus: async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("agents")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating agent status:", error);
      toast.error("Failed to update agent status");
      return false;
    }
  },
  
  addAgent: async (agentData: any) => {
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: agentData.email,
        password: agentData.password,
        email_confirm: true,
      });
      
      if (authError) throw authError;
      
      // Then create agent record
      const { error } = await supabase
        .from("agents")
        .insert({
          id: authData.user.id,
          name: agentData.name,
          email: agentData.email,
          commission_rate: agentData.commission || 10,
        });
        
      if (error) throw error;
      
      // Update user role to agent
      const { error: roleError } = await supabase
        .from("user_roles")
        .update({ role: "agent" })
        .eq("user_id", authData.user.id);
        
      if (roleError) throw roleError;
      
      return true;
    } catch (error) {
      console.error("Error adding agent:", error);
      toast.error("Failed to add agent");
      return false;
    }
  }
};

// User Service
export const userService = {
  getUsers: async () => {
    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select(`
          id,
          first_name,
          last_name,
          phone,
          created_at
        `)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      // Get user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");
        
      if (rolesError) throw rolesError;
      
      // Map roles to users
      const usersWithRoles = data?.map(user => {
        const userRole = rolesData?.find(role => role.user_id === user.id);
        return {
          ...user,
          role: userRole?.role || "user",
          status: "active" // We'll assume active for now, but this could be enhanced
        };
      });
      
      return usersWithRoles || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
      return [];
    }
  }
};

// Booking Service
export const bookingService = {
  getBookings: async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          trips:trip_id(name, source, destination),
          agents:agent_id(name, email)
        `)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to fetch bookings");
      return [];
    }
  },
  
  updateBookingStatus: async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating booking status:", error);
      toast.error("Failed to update booking status");
      return false;
    }
  },

  getTripBookedSeats: async (tripId: string) => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("seats")
        .eq("trip_id", tripId)
        .in("status", ["confirmed", "pending"]);
        
      if (error) throw error;
      
      // Extract all booked seats
      let bookedSeats: string[] = [];
      if (data) {
        data.forEach(booking => {
          const seats = booking.seats as string[];
          bookedSeats = [...bookedSeats, ...seats];
        });
      }
      
      return bookedSeats;
    } catch (error) {
      console.error("Error fetching booked seats:", error);
      toast.error("Failed to fetch seat availability");
      return [];
    }
  },
  
  createBooking: async (bookingData: any) => {
    try {
      // Convert passengers and seats to the proper Json type for Supabase
      const formattedData = {
        ...bookingData,
        passengers: bookingData.passengers as Json,
        seats: bookingData.seats as Json
      };
      
      const { data, error } = await supabase
        .from("bookings")
        .insert(formattedData)
        .select();
        
      if (error) throw error;
      
      return data[0] || null;
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("Failed to create booking");
      return null;
    }
  }
};

// Commission Service
export const commissionService = {
  getCommissions: async () => {
    try {
      const { data, error } = await supabase
        .from("commissions")
        .select(`
          *,
          agents:agent_id(name, email),
          bookings:booking_id(booking_number, total_amount)
        `)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching commissions:", error);
      toast.error("Failed to fetch commissions");
      return [];
    }
  },
  
  updateCommissionStatus: async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from("commissions")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating commission status:", error);
      toast.error("Failed to update commission status");
      return false;
    }
  }
};
