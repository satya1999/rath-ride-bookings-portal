
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface DocumentUploadProps {
  onFileChange: (type: 'front' | 'back', file: File) => void;
  aadharFront: File | null;
  aadharBack: File | null;
}

const DocumentUpload = ({ onFileChange, aadharFront, aadharBack }: DocumentUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'back') => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(type, e.target.files[0]);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Identity Verification</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <FormLabel className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Aadhar Card Front
          </FormLabel>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'front')}
            />
            {aadharFront && <span className="text-green-600 text-sm">Uploaded</span>}
          </div>
        </div>
        
        <div className="space-y-2">
          <FormLabel className="flex items-center gap-2">
            <Upload className="h-4 w-4" /> Aadhar Card Back
          </FormLabel>
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'back')}
            />
            {aadharBack && <span className="text-green-600 text-sm">Uploaded</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUpload;
