
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface LayoutUploadOptions {
  onLayoutAdded?: (layout: { name: string; type: string; configuration?: any }) => void;
}

export function useLayoutUpload({ onLayoutAdded }: LayoutUploadOptions) {
  const [file, setFile] = useState<File | null>(null);
  const [layoutName, setLayoutName] = useState("");
  const [layoutType, setLayoutType] = useState("sleeper");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file && !layoutName.trim()) {
      toast.error("Please select a file to upload or enter a layout name");
      return;
    }

    if (!layoutName.trim()) {
      toast.error("Please enter a layout name");
      return;
    }

    setUploading(true);
    
    try {
      // Generate configuration based on layout type
      const configuration = generateConfiguration(layoutType);
      
      // Save to localStorage for backward compatibility
      const layoutData = {
        name: layoutName,
        type: layoutType,
        configuration: configuration
      };
      
      localStorage.setItem('lastBusLayout', JSON.stringify(layoutData));
      
      if (onLayoutAdded) {
        onLayoutAdded(layoutData);
      }
      
      toast.success(`Bus layout "${layoutName}" uploaded successfully`);
      
      // Clear form
      setFile(null);
      setLayoutName("");
      
      console.log("Layout name:", layoutName);
      console.log("Layout type:", layoutType);
      console.log("File:", file);
    } catch (error) {
      console.error("Error uploading layout:", error);
      toast.error("Failed to upload layout");
    } finally {
      setUploading(false);
    }
  };

  return {
    file,
    layoutName,
    layoutType,
    uploading,
    setLayoutName,
    setLayoutType,
    handleFileChange,
    handleSubmit
  };
}

// Helper function to generate configuration based on layout type
function generateConfiguration(layoutType: string) {
  let configuration = {};
  
  switch(layoutType) {
    case "sleeper":
      configuration = {
        upperDeck: true,
        lowerDeck: false
      };
      break;
    case "seater":
      configuration = {
        upperDeck: false,
        lowerDeck: true
      };
      break;
    case "1x2-sleeper":
      configuration = {
        upperDeck: true,
        lowerDeck: false,
        layout: "1x2",
        type: "sleeper"
      };
      break;
    case "2x2-seater":
      configuration = {
        upperDeck: false,
        lowerDeck: true,
        layout: "2x2",
        type: "seater"
      };
      break;
    case "2x2-sleeper":
      configuration = {
        upperDeck: true,
        lowerDeck: true,
        layout: "2x2",
        type: "sleeper"
      };
      break;
    default:
      configuration = {
        upperDeck: false,
        lowerDeck: true
      };
  }
  
  return configuration;
}
