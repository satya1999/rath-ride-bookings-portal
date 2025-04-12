
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteLayoutDialogProps {
  layoutInfo: { id: string; name: string } | null;
  onClose: () => void;
  onDelete: (id: string, name: string) => void;
}

export const DeleteLayoutDialog = ({ layoutInfo, onClose, onDelete }: DeleteLayoutDialogProps) => {
  if (!layoutInfo) return null;

  return (
    <Dialog open={!!layoutInfo} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Layout</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this layout? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Layout name: <span className="font-medium">{layoutInfo.name}</span></p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onDelete(layoutInfo.id, layoutInfo.name)}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
