
import AdminLayout from "@/components/layout/AdminLayout";
import { BusLayoutUploader } from "@/components/admin/bus/BusLayoutUploader";
import { BusLayoutsTable } from "@/components/admin/bus/BusLayoutsTable";

// Mock data for layouts with properly typed status values
const busLayouts = [
  {
    id: "1",
    name: "Volvo 9400 Sleeper (38 Seats)",
    type: "sleeper",
    createdAt: "2023-08-15",
    status: "active" as const,
  },
  {
    id: "2",
    name: "Mercedes Benz 2441 (45 Seats)",
    type: "seater",
    createdAt: "2023-09-22",
    status: "active" as const,
  },
  {
    id: "3",
    name: "Scania Metrolink (40 Seats)",
    type: "semi-sleeper",
    createdAt: "2023-07-01",
    status: "inactive" as const,
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
          <BusLayoutsTable layouts={busLayouts} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default BusLayoutsPage;
