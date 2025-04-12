
import React from "react";
import { Sun, Monitor } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <ToggleGroup 
      type="single" 
      value={theme} 
      onValueChange={(value) => {
        if (value) setTheme(value as "light" | "system");
      }}
      className="border rounded-md"
    >
      <ToggleGroupItem value="light" aria-label="Light mode">
        <Sun className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="system" aria-label="System mode">
        <Monitor className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
