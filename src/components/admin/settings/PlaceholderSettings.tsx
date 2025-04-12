
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

interface PlaceholderSettingsProps {
  title: string;
  description: string;
}

export const PlaceholderSettings = ({ title, description }: PlaceholderSettingsProps) => {
  const handleSave = () => {
    toast.success("Settings updated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Configure your {title.toLowerCase()} settings here.</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};
