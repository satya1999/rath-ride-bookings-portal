
import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const BusLayoutUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [layoutName, setLayoutName] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error("Please select a file to upload");
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
      setFile(null);
      setLayoutName("");
      
      // In a real implementation, you would send the file to your backend
      console.log("Layout name:", layoutName);
      console.log("File:", file);
    }, 1500);
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
