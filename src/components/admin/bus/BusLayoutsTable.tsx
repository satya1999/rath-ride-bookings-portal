
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
            {layouts.map((layout) => (
              <TableRow key={layout.id}>
                <TableCell className="font-medium">{layout.name}</TableCell>
                <TableCell className="capitalize">{layout.type}</TableCell>
                <TableCell>{new Date(layout.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={layout.status === "active" ? "default" : "secondary"}
                    className={layout.status === "active" ? "bg-green-600" : ""}
                  >
                    {layout.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-destructive">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
