
import { useState } from "react";
import { useTrips } from "@/hooks/useTrips";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TripTable from "./TripTable";
import AddTripDialog from "./dialogs/AddTripDialog";
import EditTripDialog from "./dialogs/EditTripDialog";
import { Trip } from "@/types/trip";

const TripManagementContainer = () => {
  const { trips, loading, addTrip, updateTrip, deleteTrip, uploadImage, updateDetails } = useTrips();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Trips</h1>
          <p className="text-muted-foreground">Create and manage pilgrimage trips</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Trip
        </Button>
      </div>

      <TripTable 
        trips={trips}
        loading={loading}
        onEdit={setEditingTrip}
        onDelete={deleteTrip}
      />

      <AddTripDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={addTrip}
      />

      {editingTrip && (
        <EditTripDialog
          trip={editingTrip}
          open={!!editingTrip}
          onOpenChange={() => setEditingTrip(null)}
          onSubmit={(data) => updateTrip(editingTrip.id, data)}
          onUploadImage={(file, title) => uploadImage(editingTrip.id, file, title)}
          onUpdateDetails={(description, itinerary, amenities) => 
            updateDetails(editingTrip.id, description, itinerary, amenities)
          }
        />
      )}
    </div>
  );
};

export default TripManagementContainer;
