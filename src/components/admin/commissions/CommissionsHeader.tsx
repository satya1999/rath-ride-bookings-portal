
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface CommissionsHeaderProps {
  title: string;
}

const CommissionsHeader = ({ title }: CommissionsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Button>
        <Download className="mr-2 h-4 w-4" />
        Export Report
      </Button>
    </div>
  );
};

export default CommissionsHeader;
