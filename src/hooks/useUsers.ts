
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
      const formattedUsers = data.map(user => {
        // Determine the user role from the user_roles array
        const userRole = user.user_roles && user.user_roles.length > 0 ? 
          user.user_roles[0].role : "user";
        
        return {
          id: user.id,
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          role: userRole,
          status: "active", // Default status since we don't have it in DB yet
          joined: user.created_at
        };
      });
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await userService.updateUserStatus(userId, newStatus);
      toast.success(`User status updated to ${newStatus}`);
      
      // Update local state
      setUsers(
        users.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        )
      );
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };
  
  const handleDeleteUser = async (userId: string) => {
    try {
      await userService.deleteUser(userId);
      toast.success("User deleted successfully");
      // Update local state
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };
  
  return {
    users,
    loading,
    handleStatusChange,
    handleDeleteUser,
    refetch: fetchUsers
  };
}
