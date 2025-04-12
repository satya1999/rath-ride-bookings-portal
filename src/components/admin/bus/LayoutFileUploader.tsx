
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LayoutFileUploaderProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const LayoutFileUploader = ({ file, onFileChange }: LayoutFileUploaderProps) => {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="layoutFile">Layout File</Label>
      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
        <Input
          id="layoutFile"
          type="file"
          className="hidden"
          accept=".json,.svg,.png,.jpg"
          onChange={onFileChange}
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
  );
};
