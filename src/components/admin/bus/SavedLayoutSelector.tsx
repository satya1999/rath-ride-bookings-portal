
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BusFront } from "lucide-react";
import { toast } from "sonner";

interface SavedLayoutSelectorProps {
  onImport: (name: string, type: string) => void;
}

export const SavedLayoutSelector = ({ onImport }: SavedLayoutSelectorProps) => {
  const [savedLayouts, setSavedLayouts] = useState<Array<{name: string, type: string}>>([]);

  useEffect(() => {
    const checkForSavedLayouts = () => {
      const lastLayout = localStorage.getItem('lastBusLayout');
      if (lastLayout) {
        try {
          const parsedLayout = JSON.parse(lastLayout);
          if (parsedLayout && parsedLayout.name) {
            setSavedLayouts(prev => {
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

    window.addEventListener('storage', checkForSavedLayouts);
    
    return () => {
      window.removeEventListener('storage', checkForSavedLayouts);
    };
  }, []);

  const handleImportSavedLayout = () => {
    const lastLayout = localStorage.getItem('lastBusLayout');
    if (lastLayout) {
      try {
        const parsedLayout = JSON.parse(lastLayout);
        const name = parsedLayout.name || "1X2 Bus Sleeper Layout";
        const type = parsedLayout.type || "sleeper";
        
        onImport(name, type);
        toast.success("Saved layout imported successfully");
      } catch (error) {
        toast.error("Error importing saved layout");
        console.error("Error parsing saved layout:", error);
      }
    } else {
      toast.error("No saved layouts found");
    }
  };

  if (savedLayouts.length === 0) {
    return null;
  }

  return (
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
  );
};
