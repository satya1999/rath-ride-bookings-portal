
import { useState, useEffect } from "react";
import { commissionService } from "@/services/api";
import { toast } from "sonner";

export interface Commission {
  id: string;
  agent: { name: string; email: string };
  booking: string;
  amount: string;
  date: string;
  status: string;
}

export function useCommissions() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchCommissions = async () => {
    setLoading(true);
    try {
      const data = await commissionService.getCommissions();
      
      // Format the data for display
      const formattedCommissions = data.map(commission => {
        return {
          id: commission.id,
          agent: {
            name: commission.agents?.name || "Unknown Agent",
            email: commission.agents?.email || ""
          },
          booking: commission.bookings?.booking_number || "Unknown Booking",
          amount: `₹${commission.amount}`,
          date: new Date(commission.created_at).toISOString().split('T')[0],
          status: commission.status
        };
      });
      
      setCommissions(formattedCommissions);
    } catch (error) {
      console.error("Error in useCommissions:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchCommissions();
  }, []);
  
  const handleStatusChange = async (commissionId: string, newStatus: string) => {
    const result = await commissionService.updateCommissionStatus(commissionId, newStatus);
    
    if (result) {
      // Update local state
      setCommissions(
        commissions.map(commission => 
          commission.id === commissionId ? { ...commission, status: newStatus } : commission
        )
      );
      
      toast.success(`Commission status updated to ${newStatus}`);
    }
  };
  
  return {
    commissions,
    loading,
    handleStatusChange,
    refetch: fetchCommissions
  };
}
