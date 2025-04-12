
import { Button } from "@/components/ui/button";
import { Edit, Trash, Eye } from "lucide-react";
import { BusLayout } from "@/hooks/useBusLayouts";

interface LayoutActionsProps {
  layout: BusLayout;
  onView: (layout: BusLayout) => void;
  onEdit: (layout: BusLayout) => void;
  onDelete: (id: string, name: string) => void;
}

export const LayoutActions = ({ layout, onView, onEdit, onDelete }: LayoutActionsProps) => {
  return (
    <div className="flex justify-end gap-2">
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onView(layout)}
        title="View layout"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={() => onEdit(layout)}
        title="Edit layout"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="text-destructive"
        onClick={() => onDelete(layout.id, layout.name)}
        title="Delete layout"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
