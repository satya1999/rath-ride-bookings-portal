
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BusLayout } from "@/hooks/useBusLayouts";

interface EditLayoutDialogProps {
  layout: BusLayout | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<BusLayout>) => void;
}

export const EditLayoutDialog = ({ layout, onClose, onUpdate }: EditLayoutDialogProps) => {
  const [form, setForm] = useState({ name: "", type: "" });
  
  // Initialize form when layout changes using useEffect
  useEffect(() => {
    if (layout) {
      setForm({
        name: layout.name,
        type: layout.type
      });
    }
  }, [layout]);

  const handleUpdate = () => {
    if (!layout) return;
    
    onUpdate(layout.id, { 
      name: form.name, 
      type: form.type 
    });
  };

  if (!layout) return null;

  return (
    <Dialog open={!!layout} onOpenChange={(open) => !open && onClose()}>
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
              value={form.name} 
              onChange={(e) => setForm({...form, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              value={form.type}
              onChange={(e) => setForm({...form, type: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
