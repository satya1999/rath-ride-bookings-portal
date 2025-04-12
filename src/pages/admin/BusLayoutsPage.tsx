
import AdminLayout from "@/components/layout/AdminLayout";
import { BusLayoutUploader } from "@/components/admin/BusLayoutUploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for layouts
const busLayouts = [
  {
    id: "1",
    name: "Volvo 9400 Sleeper (38 Seats)",
    type: "sleeper",
    createdAt: "2023-08-15",
    status: "active",
  },
  {
    id: "2",
    name: "Mercedes Benz 2441 (45 Seats)",
    type: "seater",
    createdAt: "2023-09-22",
    status: "active",
  },
  {
    id: "3",
    name: "Scania Metrolink (40 Seats)",
    type: "semi-sleeper",
    createdAt: "2023-07-01",
    status: "inactive",
  },
];

const BusLayoutsPage = () => {
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bus Layouts</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <BusLayoutUploader />
        </div>
        <div className="md:col-span-2">
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
                  {busLayouts.map((layout) => (
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default BusLayoutsPage;
