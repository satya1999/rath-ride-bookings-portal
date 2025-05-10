
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SavedLayoutSelector } from "./SavedLayoutSelector";
import { LayoutFileUploader } from "./LayoutFileUploader";
import { useLayoutUpload } from "@/hooks/useLayoutUpload";

interface BusLayoutUploaderProps {
  onLayoutAdded?: (layout: { name: string; type: string; configuration?: any }) => void;
}

export const BusLayoutUploader = ({ onLayoutAdded }: BusLayoutUploaderProps) => {
  const { 
    file, 
    layoutName, 
    layoutType, 
    uploading, 
    setLayoutName, 
    setLayoutType, 
    handleFileChange, 
    handleSubmit 
  } = useLayoutUpload({ onLayoutAdded });

  const handleImportSavedLayout = (name: string, type: string) => {
    setLayoutName(name);
    setLayoutType(type);
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
                <SelectItem value="2x2-sleeper">2X2 Sleeper</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <LayoutFileUploader file={file} onFileChange={handleFileChange} />
          
          <SavedLayoutSelector onImport={handleImportSavedLayout} />
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
