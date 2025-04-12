
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AgentSearchProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const AgentSearch = ({ searchTerm, onSearchChange }: AgentSearchProps) => {
  return (
    <div className="relative w-64">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search agents..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
  );
};
