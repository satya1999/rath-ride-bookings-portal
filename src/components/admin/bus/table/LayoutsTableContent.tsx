
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BusLayout } from "@/hooks/useBusLayouts";
import { LayoutStatusCell } from "./LayoutStatusCell";
import { LayoutActions } from "./LayoutActions";

interface LayoutsTableContentProps {
  layouts: BusLayout[];
  onView: (layout: BusLayout) => void;
  onEdit: (layout: BusLayout) => void;
  onDelete: (id: string, name: string) => void;
  onToggleStatus: (id: string) => void;
}

export const LayoutsTableContent = ({ 
  layouts, 
  onView, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}: LayoutsTableContentProps) => {
  if (layouts.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
          No layouts found. Upload a new layout or add a predefined one.
        </TableCell>
      </TableRow>
    );
  }
  
  return (
    <>
      {layouts.map((layout) => (
        <TableRow key={layout.id}>
          <TableCell className="font-medium">{layout.name}</TableCell>
          <TableCell>
            <Badge variant="outline" className="capitalize">
              {layout.type.replace('-', ' ')}
            </Badge>
          </TableCell>
          <TableCell>{new Date(layout.createdAt).toLocaleDateString()}</TableCell>
          <TableCell>
            <LayoutStatusCell 
              status={layout.status} 
              onToggleStatus={() => onToggleStatus(layout.id)}
            />
          </TableCell>
          <TableCell className="text-right">
            <LayoutActions 
              layout={layout}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
