
import { useState } from "react";
import { toast } from "sonner";

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
    
    setTimeout(() => {
      toast.success(`Bus layout "${layoutName}" uploaded successfully`);
      setUploading(false);
      
      if (onLayoutAdded) {
        const configuration = generateConfiguration(layoutType);
        
        onLayoutAdded({
          name: layoutName,
          type: layoutType,
          configuration: configuration
        });
      }
      
      setFile(null);
      setLayoutName("");
      
      console.log("Layout name:", layoutName);
      console.log("Layout type:", layoutType);
      console.log("File:", file);
    }, 1500);
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
        layout: "1x2"
      };
      break;
    case "2x2-seater":
      configuration = {
        upperDeck: false,
        lowerDeck: true,
        layout: "2x2"
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
