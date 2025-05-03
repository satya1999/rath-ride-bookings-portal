
import { Button } from "@/components/ui/button";

interface CommissionStatusFiltersProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const CommissionStatusFilters = ({ statusFilter, setStatusFilter }: CommissionStatusFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant={statusFilter === "all" ? "default" : "outline"}
        onClick={() => setStatusFilter("all")}
      >
        All
      </Button>
      <Button 
        variant={statusFilter === "paid" ? "default" : "outline"}
        className={statusFilter === "paid" ? "bg-green-600" : ""}
        onClick={() => setStatusFilter("paid")}
      >
        Paid
      </Button>
      <Button 
        variant={statusFilter === "pending" ? "default" : "outline"}
        className={statusFilter === "pending" ? "bg-amber-500" : ""}
        onClick={() => setStatusFilter("pending")}
      >
        Pending
      </Button>
      <Button 
        variant={statusFilter === "rejected" ? "default" : "outline"}
        className={statusFilter === "rejected" ? "bg-red-500" : ""}
        onClick={() => setStatusFilter("rejected")}
      >
        Rejected
      </Button>
    </div>
  );
};

export default CommissionStatusFilters;
