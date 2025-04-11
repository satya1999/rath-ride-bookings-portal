
import PageLayout from "@/components/layout/PageLayout";
import TripList from "@/components/trips/TripList";

const TripsPage = () => {
  return (
    <PageLayout>
      <h1 className="text-3xl font-bold mb-2">Pilgrimage & Tour Packages</h1>
      <p className="text-gray-600 mb-6">Browse our selection of religious and cultural tour packages</p>
      <TripList />
    </PageLayout>
  );
};

export default TripsPage;
