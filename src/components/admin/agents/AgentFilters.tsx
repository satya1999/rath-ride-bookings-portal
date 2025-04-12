
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AgentFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export const AgentFilters = ({ activeFilter, onFilterChange }: AgentFiltersProps) => {
  return (
    <div className="flex space-x-2">
      <Button 
        variant={activeFilter === "all" ? "default" : "outline"} 
        onClick={() => onFilterChange("all")}
      >
        All
      </Button>
      <Button 
        variant={activeFilter === "active" ? "default" : "outline"}
        onClick={() => onFilterChange("active")}
      >
        Active
      </Button>
      <Button 
        variant={activeFilter === "inactive" ? "default" : "outline"}
        onClick={() => onFilterChange("inactive")}
      >
        Inactive
      </Button>
    </div>
  );
};
