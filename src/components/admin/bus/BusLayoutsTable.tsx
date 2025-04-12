
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody } from "@/components/ui/table";
import { ViewLayoutDialog } from "./dialogs/ViewLayoutDialog";
import { EditLayoutDialog } from "./dialogs/EditLayoutDialog";
import { DeleteLayoutDialog } from "./dialogs/DeleteLayoutDialog";
import { LayoutsTableContent } from "./table/LayoutsTableContent";
import { BusLayout } from "@/hooks/useBusLayouts";

interface BusLayoutsTableProps {
  layouts: BusLayout[];
  onDelete?: (id: string) => void;
  onUpdate?: (id: string, layout: Partial<BusLayout>) => void;
}

export const BusLayoutsTable = ({ layouts, onDelete, onUpdate }: BusLayoutsTableProps) => {
  const [viewLayout, setViewLayout] = useState<BusLayout | null>(null);
  const [editLayout, setEditLayout] = useState<BusLayout | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{id: string; name: string} | null>(null);

  const handleToggleStatus = (id: string) => {
    // Find the layout and get its current status
    const layout = layouts.find(l => l.id === id);
    if (!layout) return;
    
    const newStatus = layout.status === "active" ? "inactive" : "active";
    
    if (onUpdate) {
      onUpdate(id, { status: newStatus });
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (onDelete) {
      onDelete(id);
    }
    
    setDeleteConfirm(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Layouts</CardTitle>
        <CardDescription>Manage your bus seating layout configurations</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <LayoutsTableContent
              layouts={layouts}
              onView={setViewLayout}
              onEdit={setEditLayout}
              onDelete={(id, name) => setDeleteConfirm({ id, name })}
              onToggleStatus={handleToggleStatus}
            />
          </TableBody>
        </Table>
        
        {/* Dialogs */}
        <ViewLayoutDialog 
          layout={viewLayout} 
          onClose={() => setViewLayout(null)} 
        />
        
        <EditLayoutDialog 
          layout={editLayout} 
          onClose={() => setEditLayout(null)}
          onUpdate={(id, updates) => {
            if (onUpdate) onUpdate(id, updates);
            setEditLayout(null);
          }}
        />
        
        <DeleteLayoutDialog 
          layoutInfo={deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onDelete={handleDelete}
        />
      </CardContent>
    </Card>
  );
};
