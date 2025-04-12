
import { useState, useEffect } from "react";
import { Upload, BusFront } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface BusLayoutUploaderProps {
  onLayoutAdded?: (layout: { name: string; type: string }) => void;
}

export const BusLayoutUploader = ({ onLayoutAdded }: BusLayoutUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [layoutName, setLayoutName] = useState("");
  const [layoutType, setLayoutType] = useState("sleeper");
  const [uploading, setUploading] = useState(false);
  const [savedLayouts, setSavedLayouts] = useState<Array<{name: string, type: string}>>([]);

  // Check for layouts in localStorage on component mount
  useEffect(() => {
    const checkForSavedLayouts = () => {
      const lastLayout = localStorage.getItem('lastBusLayout');
      if (lastLayout) {
        try {
          const parsedLayout = JSON.parse(lastLayout);
          if (parsedLayout && parsedLayout.name) {
            setSavedLayouts(prev => {
              // Only add if not already in the list
              if (!prev.some(layout => layout.name === parsedLayout.name)) {
                return [...prev, {
                  name: parsedLayout.name,
                  type: parsedLayout.type || 'sleeper'
                }];
              }
              return prev;
            });
          }
        } catch (error) {
          console.error("Error parsing saved layout:", error);
        }
      }
    };

    checkForSavedLayouts();

    // Set up a listener for storage events
    window.addEventListener('storage', checkForSavedLayouts);
    
    return () => {
      window.removeEventListener('storage', checkForSavedLayouts);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file && !savedLayouts.length) {
      toast.error("Please select a file to upload or choose a saved layout");
      return;
    }

    if (!layoutName.trim()) {
      toast.error("Please enter a layout name");
      return;
    }

    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      toast.success(`Bus layout "${layoutName}" uploaded successfully`);
      setUploading(false);
      
      if (onLayoutAdded) {
        onLayoutAdded({
          name: layoutName,
          type: layoutType
        });
      }
      
      setFile(null);
      setLayoutName("");
      
      // In a real implementation, you would send the file to your backend
      console.log("Layout name:", layoutName);
      console.log("Layout type:", layoutType);
      console.log("File:", file);
    }, 1500);
  };

  const handleImportSavedLayout = () => {
    const lastLayout = localStorage.getItem('lastBusLayout');
    if (lastLayout) {
      try {
        const parsedLayout = JSON.parse(lastLayout);
        setLayoutName(parsedLayout.name || "1X2 Bus Sleeper Layout");
        setLayoutType(parsedLayout.type || "sleeper");
        
        toast.success("Saved layout imported successfully");
      } catch (error) {
        toast.error("Error importing saved layout");
        console.error("Error parsing saved layout:", error);
      }
    } else {
      toast.error("No saved layouts found");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Bus Layout</CardTitle>
        <CardDescription>
          Upload a bus seating layout diagram or configuration file
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="layoutName">Layout Name</Label>
            <Input 
              id="layoutName" 
              placeholder="e.g., Volvo 9400 Sleeper (38 Seats)"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              required
            />
          </div>

          <div className="grid w-full gap-1.5">
            <Label htmlFor="layoutType">Layout Type</Label>
            <Select value={layoutType} onValueChange={(value) => setLayoutType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select layout type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="seater">Seater</SelectItem>
                <SelectItem value="sleeper">Sleeper</SelectItem>
                <SelectItem value="semi-sleeper">Semi-Sleeper</SelectItem>
                <SelectItem value="1x2-sleeper">1X2 Sleeper</SelectItem>
                <SelectItem value="2x2-seater">2X2 Seater</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid w-full gap-1.5">
            <Label htmlFor="layoutFile">Layout File</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
              <Input
                id="layoutFile"
                type="file"
                className="hidden"
                accept=".json,.svg,.png,.jpg"
                onChange={handleFileChange}
              />
              <Label 
                htmlFor="layoutFile" 
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="h-8 w-8 text-muted-foreground/70" />
                <span className="text-muted-foreground font-medium">
                  Click to upload layout file
                </span>
                <span className="text-xs text-muted-foreground/70">
                  Supports SVG, PNG, JPG or JSON configuration
                </span>
              </Label>
              {file && (
                <div className="mt-2 text-sm text-muted-foreground bg-muted p-2 rounded">
                  Selected: {file.name}
                </div>
              )}
            </div>
          </div>
          
          {savedLayouts.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label>Saved Layouts</Label>
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleImportSavedLayout}
              >
                <BusFront size={16} />
                Import 1X2 Bus Layout
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Layout"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
