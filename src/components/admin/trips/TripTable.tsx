
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Trip } from "@/types/trip";
import { format } from "date-fns";

interface TripTableProps {
  trips: Trip[];
  loading: boolean;
  onEdit: (trip: Trip) => void;
  onDelete: (id: string) => void;
}

const TripTable = ({ trips, loading, onEdit, onDelete }: TripTableProps) => {
  if (loading) {
    return <div>Loading trips...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Route</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Fare</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trips.map((trip) => (
          <TableRow key={trip.id}>
            <TableCell>{trip.title}</TableCell>
            <TableCell>{trip.from} to {trip.to}</TableCell>
            <TableCell>{format(trip.date, "dd MMM yyyy")}</TableCell>
            <TableCell>₹{trip.fare.toLocaleString()}</TableCell>
            <TableCell className="space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(trip)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onDelete(trip.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TripTable;
