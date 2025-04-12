
import { useForm } from "react-hook-form";
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
import { Form } from "@/components/ui/form";

interface PlaceholderSettingsProps {
  title: string;
  description: string;
}

export const PlaceholderSettings = ({ title, description }: PlaceholderSettingsProps) => {
  const form = useForm();
  
  const handleSave = () => {
    toast.success("Settings updated successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSave)}>
          <CardContent>
            <p className="text-sm text-muted-foreground">Configure your {title.toLowerCase()} settings here.</p>
          </CardContent>
          <CardFooter>
            <Button type="submit">Save Changes</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
