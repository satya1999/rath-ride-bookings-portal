
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Eye } from "lucide-react";
import { BusLayout } from "@/hooks/useBusLayouts";

interface LayoutActionsProps {
  layout: BusLayout;
  onView: (layout: BusLayout) => void;
  onEdit: (layout: BusLayout) => void;
  onDelete: (id: string, name: string) => void;
  isLoading?: boolean;
}

export const LayoutActions = ({ 
  layout, 
  onView, 
  onEdit, 
  onDelete, 
  isLoading = false 
}: LayoutActionsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      await onDelete(layout.id, layout.name);
    } catch (error) {
      console.error("Error deleting layout:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onView(layout)}
        title="View layout"
        disabled={isLoading || isProcessing}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onEdit(layout)}
        title="Edit layout"
        disabled={isLoading || isProcessing}
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="text-destructive"
        onClick={handleDelete}
        title="Delete layout"
        disabled={isLoading || isProcessing}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
