
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Eye, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";

// Bus layout type definition
interface BusLayout {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  status: "active" | "inactive";
}

interface BusLayoutsTableProps {
  layouts: BusLayout[];
}

export const BusLayoutsTable = ({ layouts }: BusLayoutsTableProps) => {
  const [currentLayouts, setCurrentLayouts] = useState<BusLayout[]>(layouts);

  const handleToggleStatus = (id: string) => {
    setCurrentLayouts(prev => 
      prev.map(layout => 
        layout.id === id 
          ? { ...layout, status: layout.status === "active" ? "inactive" : "active" } 
          : layout
      )
    );
    
    toast.success("Layout status updated successfully");
  };

  const handleDelete = (id: string, name: string) => {
    setCurrentLayouts(prev => prev.filter(layout => layout.id !== id));
    toast.success(`Layout "${name}" deleted successfully`);
  };

  const handleView = (name: string) => {
    toast.info(`Viewing layout: ${name}`);
  };

  const handleEdit = (name: string) => {
    toast.info(`Editing layout: ${name}`);
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
            {currentLayouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No layouts found. Upload a new layout or add a predefined one.
                </TableCell>
              </TableRow>
            ) : (
              currentLayouts.map((layout) => (
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
                        onClick={() => handleView(layout.name)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleEdit(layout.name)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-destructive"
                        onClick={() => handleDelete(layout.id, layout.name)}
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
      </CardContent>
    </Card>
  );
};
