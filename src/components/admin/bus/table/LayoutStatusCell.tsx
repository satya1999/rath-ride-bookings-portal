
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

interface LayoutStatusCellProps {
  status: "active" | "inactive";
  onToggleStatus: () => void;
  isLoading?: boolean;
}

export const LayoutStatusCell = ({ status, onToggleStatus, isLoading = false }: LayoutStatusCellProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleToggle = async () => {
    setIsUpdating(true);
    try {
      await onToggleStatus();
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant={status === "active" ? "default" : "secondary"}
        className={status === "active" ? "bg-green-600" : ""}
      >
        {status}
      </Badge>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6" 
        onClick={handleToggle}
        title={status === "active" ? "Deactivate" : "Activate"}
        disabled={isLoading || isUpdating}
      >
        {status === "active" ? (
          <X className="h-3 w-3" />
        ) : (
          <Check className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
};
