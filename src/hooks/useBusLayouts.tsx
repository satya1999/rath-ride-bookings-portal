
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
  const [busLayouts, setBusLayouts] = useState<BusLayout[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch bus layouts from Supabase
  useEffect(() => {
    fetchBusLayouts();
  }, []);

  const fetchBusLayouts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bus_layouts')
        .select('*');

      if (error) {
        throw error;
      }

      if (data) {
        // Transform data to match our BusLayout interface
        const formattedLayouts: BusLayout[] = data.map(layout => ({
          id: layout.id,
          name: layout.name,
          type: layout.type,
          createdAt: layout.created_at,
          status: layout.status as "active" | "inactive",
          configuration: layout.configuration
        }));
        
        setBusLayouts(formattedLayouts);
      }
    } catch (error) {
      console.error("Error fetching bus layouts:", error);
      toast.error("Failed to load bus layouts");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLayout = async (layoutType: string) => {
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
    
    try {
      const { data, error } = await supabase
        .from('bus_layouts')
        .insert({
          name: layoutName,
          type: layoutType.includes("sleeper") ? "sleeper" : "seater",
          configuration,
          status: "active"
        })
        .select();
      
      if (error) throw error;
      
      if (data && data[0]) {
        const newLayout: BusLayout = {
          id: data[0].id,
          name: data[0].name,
          type: data[0].type,
          createdAt: data[0].created_at,
          status: data[0].status as "active" | "inactive",
          configuration: data[0].configuration
        };
        
        setBusLayouts(prev => [...prev, newLayout]);
        toast.success(`${layoutName} added successfully`);
      }
    } catch (error) {
      console.error("Error adding layout:", error);
      toast.error("Failed to add layout");
    }
  };
  
  const handleLayoutDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bus_layouts')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setBusLayouts(prev => prev.filter(layout => layout.id !== id));
      toast.success("Layout deleted successfully");
    } catch (error) {
      console.error("Error deleting layout:", error);
      toast.error("Failed to delete layout");
    }
  };
  
  const handleLayoutUpdate = async (id: string, updatedData: Partial<BusLayout>) => {
    try {
      // Convert from our frontend model to the database model
      const dbData: any = {
        ...(updatedData.name && { name: updatedData.name }),
        ...(updatedData.type && { type: updatedData.type }),
        ...(updatedData.status && { status: updatedData.status }),
        ...(updatedData.configuration && { configuration: updatedData.configuration })
      };
      
      const { error } = await supabase
        .from('bus_layouts')
        .update(dbData)
        .eq('id', id);
        
      if (error) throw error;
      
      setBusLayouts(prev => 
        prev.map(layout => 
          layout.id === id 
            ? { ...layout, ...updatedData } 
            : layout
        )
      );
      
      toast.success("Layout updated successfully");
    } catch (error) {
      console.error("Error updating layout:", error);
      toast.error("Failed to update layout");
    }
  };

  const handleLayoutAdded = async (layout: { name: string; type: string; configuration?: any }) => {
    try {
      const { data, error } = await supabase
        .from('bus_layouts')
        .insert({
          name: layout.name,
          type: layout.type,
          configuration: layout.configuration || {},
          status: "active"
        })
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        const newLayout: BusLayout = {
          id: data[0].id,
          name: data[0].name,
          type: data[0].type,
          createdAt: data[0].created_at,
          status: data[0].status as "active" | "inactive",
          configuration: data[0].configuration
        };
        
        setBusLayouts(prev => [...prev, newLayout]);
      }
    } catch (error) {
      console.error("Error adding layout:", error);
      toast.error("Failed to add layout");
    }
  };

  return {
    busLayouts,
    loading,
    handleAddLayout,
    handleLayoutDelete,
    handleLayoutUpdate,
    handleLayoutAdded
  };
};
