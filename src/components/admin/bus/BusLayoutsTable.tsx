
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Eye, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  const [editForm, setEditForm] = useState({ name: "", type: "" });

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

  const handleView = (layout: BusLayout) => {
    setViewLayout(layout);
  };

  const handleEdit = (layout: BusLayout) => {
    setEditLayout(layout);
    setEditForm({
      name: layout.name,
      type: layout.type
    });
  };
  
  const handleUpdate = () => {
    if (!editLayout) return;
    
    if (onUpdate) {
      onUpdate(editLayout.id, { 
        name: editForm.name, 
        type: editForm.type 
      });
    }
    
    setEditLayout(null);
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
            {layouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No layouts found. Upload a new layout or add a predefined one.
                </TableCell>
              </TableRow>
            ) : (
              layouts.map((layout) => (
                <TableRow key={layout.id}>
                  <TableCell className="font-medium">{layout.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {layout.type.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(layout.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={layout.status === "active" ? "default" : "secondary"}
                        className={layout.status === "active" ? "bg-green-600" : ""}
                      >
                        {layout.status}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => handleToggleStatus(layout.id)}
                        title={layout.status === "active" ? "Deactivate" : "Activate"}
                      >
                        {layout.status === "active" ? (
                          <X className="h-3 w-3" />
                        ) : (
                          <Check className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleView(layout)}
                        title="View layout"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEdit(layout)}
                        title="Edit layout"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => setDeleteConfirm({ id: layout.id, name: layout.name })}
                        title="Delete layout"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* View Layout Dialog */}
        {viewLayout && (
          <Dialog open={!!viewLayout} onOpenChange={(open) => !open && setViewLayout(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{viewLayout.name}</DialogTitle>
                <DialogDescription>Layout details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Type</Label>
                  <div className="mt-1 p-2 border rounded-md bg-muted">
                    {viewLayout.type}
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <Badge variant={viewLayout.status === "active" ? "default" : "secondary"}>
                      {viewLayout.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Created</Label>
                  <div className="mt-1 p-2 border rounded-md bg-muted">
                    {new Date(viewLayout.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {viewLayout.configuration && (
                  <div>
                    <Label>Configuration</Label>
                    <div className="mt-1 p-2 border rounded-md bg-muted h-40 overflow-y-auto">
                      <pre className="text-xs">{JSON.stringify(viewLayout.configuration, null, 2)}</pre>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={() => setViewLayout(null)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Edit Layout Dialog */}
        {editLayout && (
          <Dialog open={!!editLayout} onOpenChange={(open) => !open && setEditLayout(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Layout</DialogTitle>
                <DialogDescription>Update layout information</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={editForm.name} 
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    value={editForm.type}
                    onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditLayout(null)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdate}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Delete Confirmation Dialog */}
        {deleteConfirm && (
          <Dialog open={!!deleteConfirm} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Layout</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this layout? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>Layout name: <span className="font-medium">{deleteConfirm.name}</span></p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(deleteConfirm.id, deleteConfirm.name)}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};
