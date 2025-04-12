
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Type definition for bus layouts
export interface BusLayout {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  status: "active" | "inactive";
  configuration?: any;
}

export const useBusLayouts = () => {
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
    const lastLayout = localStorage.getItem('lastBusLayout');
    if (lastLayout) {
      try {
        const parsedLayout = JSON.parse(lastLayout);
        if (parsedLayout && parsedLayout.name) {
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
  };
  
  const handleLayoutUpdate = (id: string, updatedData: Partial<BusLayout>) => {
    setBusLayouts(prev => 
      prev.map(layout => 
        layout.id === id 
          ? { ...layout, ...updatedData } 
          : layout
      )
    );
  };

  const handleLayoutAdded = (layout: { name: string; type: string; configuration?: any }) => {
    setBusLayouts(prev => [...prev, {
      id: (prev.length + 1).toString(),
      name: layout.name,
      type: layout.type,
      createdAt: new Date().toISOString().split('T')[0],
      status: "active" as const,
      configuration: layout.configuration || {}
    }]);
  };

  return {
    busLayouts,
    handleAddLayout,
    handleLayoutDelete,
    handleLayoutUpdate,
    handleLayoutAdded
  };
};
