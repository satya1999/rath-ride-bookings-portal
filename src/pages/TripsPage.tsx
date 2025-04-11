
import PageLayout from "@/components/layout/PageLayout";
import TripList from "@/components/trips/TripList";

const TripsPage = () => {
  return (
    <PageLayout>
      <h1 className="mb-2">Available Trips</h1>
      <p className="text-gray-600 mb-6">Browse and book trips for your customers</p>
      <TripList />
    </PageLayout>
  );
};

export default TripsPage;
