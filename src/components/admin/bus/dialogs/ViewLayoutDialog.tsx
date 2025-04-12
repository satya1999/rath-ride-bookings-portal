
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BusLayout } from "@/hooks/useBusLayouts";

interface ViewLayoutDialogProps {
  layout: BusLayout | null;
  onClose: () => void;
}

export const ViewLayoutDialog = ({ layout, onClose }: ViewLayoutDialogProps) => {
  if (!layout) return null;

  return (
    <Dialog open={!!layout} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{layout.name}</DialogTitle>
          <DialogDescription>Layout details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Type</Label>
            <div className="mt-1 p-2 border rounded-md bg-muted">
              {layout.type}
            </div>
          </div>
          <div>
            <Label>Status</Label>
            <div className="mt-1">
              <Badge variant={layout.status === "active" ? "default" : "secondary"}>
                {layout.status}
              </Badge>
            </div>
          </div>
          <div>
            <Label>Created</Label>
            <div className="mt-1 p-2 border rounded-md bg-muted">
              {new Date(layout.createdAt).toLocaleDateString()}
            </div>
          </div>
          {layout.configuration && (
            <div>
              <Label>Configuration</Label>
              <div className="mt-1 p-2 border rounded-md bg-muted h-40 overflow-y-auto">
                <pre className="text-xs">{JSON.stringify(layout.configuration, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
