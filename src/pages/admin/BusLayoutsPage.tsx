
import { useEffect, useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { BusLayoutUploader } from "@/components/admin/bus/BusLayoutUploader";
import { BusLayoutsTable } from "@/components/admin/bus/BusLayoutsTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Type definition for bus layouts
interface BusLayout {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  status: "active" | "inactive";
  configuration?: any;
}

const BusLayoutsPage = () => {
  const [busLayouts, setBusLayouts] = useState<BusLayout[]>([
    {
      id: "1",
      name: "Volvo 9400 Sleeper (38 Seats)",
      type: "sleeper",
      createdAt: "2023-08-15",
      status: "active" as const,
      configuration: { 
        upperDeck: true, 
        lowerDeck: true,
        seats: 38
      }
    },
    {
      id: "2",
      name: "Mercedes Benz 2441 (45 Seats)",
      type: "seater",
      createdAt: "2023-09-22",
      status: "active" as const,
      configuration: {
        upperDeck: false,
        lowerDeck: true,
        seats: 45
      }
    },
    {
      id: "3",
      name: "Scania Metrolink (40 Seats)",
      type: "semi-sleeper",
      createdAt: "2023-07-01",
      status: "inactive" as const,
      configuration: {
        upperDeck: false,
        lowerDeck: true,
        seats: 40
      }
    },
    {
      id: "4",
      name: "2x2 Standard Seater (40 Seats)",
      type: "seater",
      createdAt: "2023-10-05",
      status: "active" as const,
      configuration: {
        upperDeck: false,
        lowerDeck: true,
        layout: "2x2",
        seats: 40
      }
    },
  ]);

  useEffect(() => {
    // Check for saved layouts in localStorage
    const lastLayout = localStorage.getItem('lastBusLayout');
    if (lastLayout) {
      try {
        const parsedLayout = JSON.parse(lastLayout);
        if (parsedLayout && parsedLayout.name) {
          // Check if this layout is already in our list
          if (!busLayouts.some(layout => layout.name === parsedLayout.name)) {
            setBusLayouts(prev => [
              ...prev,
              {
                id: (prev.length + 1).toString(),
                name: parsedLayout.name,
                type: parsedLayout.type || "sleeper",
                createdAt: new Date().toISOString().split('T')[0],
                status: "active" as const,
                configuration: parsedLayout.configuration
              }
            ]);
          }
        }
      } catch (error) {
        console.error("Error parsing saved layout:", error);
      }
    }
  }, []);

  const handleAddLayout = (layoutType: string) => {
    let layoutName = "";
    let configuration = {};
    
    switch(layoutType) {
      case "1x2-sleeper":
        layoutName = "1X2 Bus Sleeper Layout";
        configuration = {
          upperDeck: true,
          lowerDeck: false,
          layout: "1x2",
          type: "sleeper"
        };
        break;
      case "2x2-seater":
        layoutName = "2X2 Standard Seater Layout";
        configuration = {
          upperDeck: false,
          lowerDeck: true,
          layout: "2x2",
          type: "seater"
        };
        break;
      default:
        layoutName = "Custom Bus Layout";
    }
    
    // Add the new layout
    const newLayout = {
      id: (busLayouts.length + 1).toString(),
      name: layoutName,
      type: layoutType.includes("sleeper") ? "sleeper" : "seater",
      createdAt: new Date().toISOString().split('T')[0],
      status: "active" as const,
      configuration
    };
    
    setBusLayouts(prev => [...prev, newLayout]);
    toast.success(`${layoutName} added successfully`);
  };
  
  const handleLayoutDelete = (id: string) => {
    setBusLayouts(prev => prev.filter(layout => layout.id !== id));
    // In a real app, you would also delete from the backend
  };
  
  const handleLayoutUpdate = (id: string, updatedData: Partial<BusLayout>) => {
    setBusLayouts(prev => 
      prev.map(layout => 
        layout.id === id 
          ? { ...layout, ...updatedData } 
          : layout
      )
    );
    // In a real app, you would also update in the backend
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Bus Layouts</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleAddLayout("1x2-sleeper")}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Plus size={16} />
            Add 1X2 Sleeper Layout
          </Button>
          <Button 
            onClick={() => handleAddLayout("2x2-seater")}
            className="flex items-center gap-2"
            variant="outline"
          >
            <Plus size={16} />
            Add 2X2 Seater Layout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="layouts" className="w-full mb-6">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="layouts">All Layouts</TabsTrigger>
          <TabsTrigger value="upload">Upload New Layout</TabsTrigger>
        </TabsList>
        
        <TabsContent value="layouts" className="mt-6">
          <BusLayoutsTable 
            layouts={busLayouts} 
            onDelete={handleLayoutDelete}
            onUpdate={handleLayoutUpdate}
          />
        </TabsContent>
        
        <TabsContent value="upload" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <BusLayoutUploader onLayoutAdded={(layout) => {
              setBusLayouts(prev => [...prev, {
                id: (prev.length + 1).toString(),
                name: layout.name,
                type: layout.type,
                createdAt: new Date().toISOString().split('T')[0],
                status: "active" as const,
                configuration: layout.configuration
              }]);
            }} />
            <div className="bg-muted p-6 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-4">Supported Layout Types</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>1X2 Bus Seating with Sleeper (Upper deck)</li>
                <li>2X2 Standard Seater Configuration</li>
                <li>2X1 Semi-Sleeper Configuration</li>
                <li>Custom configurations via JSON upload</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">
                You can also save layouts directly from the seat selection interface when booking a trip.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default BusLayoutsPage;
