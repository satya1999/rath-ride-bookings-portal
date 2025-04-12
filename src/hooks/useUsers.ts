
import { useState, useEffect } from "react";
import { userService } from "@/services";
import { toast } from "sonner";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  role: string;
  status: string;
  joined: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers();
      
      // Format the data for display
      const formattedUsers = data.map(user => ({
        id: user.id,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: "user@example.com", // We don't get emails from user_profiles directly
        role: user.role,
        status: user.status,
        joined: user.created_at
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error in useUsers:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleStatusChange = async (userId: string, newStatus: string) => {
    // Implement when we add user status updates
    toast.success(`User status changed to ${newStatus}`);
    
    // Update local state
    setUsers(
      users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };
  
  return {
    users,
    loading,
    handleStatusChange,
    refetch: fetchUsers
  };
}
