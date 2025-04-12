
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface LayoutStatusCellProps {
  status: "active" | "inactive";
  onToggleStatus: () => void;
}

export const LayoutStatusCell = ({ status, onToggleStatus }: LayoutStatusCellProps) => {
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
        onClick={onToggleStatus}
        title={status === "active" ? "Deactivate" : "Activate"}
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
