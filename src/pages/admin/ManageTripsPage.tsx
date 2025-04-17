
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import TripManagementContainer from "@/components/admin/trips/TripManagementContainer";

const ManageTripsPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      toast({
        title: "Authentication required",
        description: "Please login to access the admin panel.",
        variant: "destructive"
      });
      navigate("/admin-login");
    }
  }, [user, isLoading, navigate, toast]);

  if (isLoading || !user) {
    return null;
  }

  return (
    <AdminLayout>
      <TripManagementContainer />
    </AdminLayout>
  );
};

export default ManageTripsPage;
