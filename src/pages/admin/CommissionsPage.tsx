
import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card } from "@/components/ui/card";
import { useCommissions } from "@/hooks/useCommissions";
import CommissionsHeader from "@/components/admin/commissions/CommissionsHeader";
import CommissionStatsCards from "@/components/admin/commissions/CommissionStatsCards";
import CommissionStatusFilters from "@/components/admin/commissions/CommissionStatusFilters";
import CommissionSearchBar from "@/components/admin/commissions/CommissionSearchBar";
import CommissionsTable from "@/components/admin/commissions/CommissionsTable";

const CommissionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { commissions, loading, handleStatusChange } = useCommissions();
  
  const filteredCommissions = commissions.filter(commission => {
    const matchesSearch = 
      commission.agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commission.booking.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    return matchesSearch && commission.status === statusFilter;
  });

  return (
    <AdminLayout>
      <CommissionsHeader title="Commissions Management" />
      <CommissionStatsCards commissions={commissions} />

      <div className="mb-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CommissionStatusFilters 
            statusFilter={statusFilter} 
            setStatusFilter={setStatusFilter} 
          />
          
          <CommissionSearchBar 
            searchTerm={searchTerm} 
            onSearchChange={setSearchTerm} 
          />
        </div>
      </div>

      <Card>
        <CommissionsTable 
          commissions={filteredCommissions} 
          loading={loading} 
          onStatusChange={handleStatusChange} 
        />
      </Card>
    </AdminLayout>
  );
};

export default CommissionsPage;
