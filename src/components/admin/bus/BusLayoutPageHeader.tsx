
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface BusLayoutPageHeaderProps {
  onAddLayout: (layoutType: string) => void;
}

export const BusLayoutPageHeader = ({ onAddLayout }: BusLayoutPageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-bold">Bus Layouts</h1>
      <div className="flex gap-2">
        <Button 
          onClick={() => onAddLayout("1x2-sleeper")}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Plus size={16} />
          Add 1X2 Sleeper Layout
        </Button>
        <Button 
          onClick={() => onAddLayout("2x2-seater")}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Plus size={16} />
          Add 2X2 Seater Layout
        </Button>
      </div>
    </div>
  );
};
