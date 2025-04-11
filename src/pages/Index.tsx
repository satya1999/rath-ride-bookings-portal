
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageLayout from "@/components/layout/PageLayout";
import TripCard from "@/components/trips/TripCard";
import { MapPin, Calendar, IndianRupee, Search } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  // Sample featured trips
  const featuredTrips = [
    {
      id: "1",
      title: "Deluxe Trip to Puri",
      from: "Bhubaneswar",
      to: "Puri",
      date: new Date(2025, 3, 15),
      departureTime: "08:00 AM",
      fare: 2500,
      availableSeats: 32,
      totalSeats: 36,
      busType: "Seater",
      imageUrl: "https://source.unsplash.com/random/600x400/?puri,temple"
    },
    {
      id: "2",
      title: "Royal Chilika Lake Trip",
      from: "Bhubaneswar",
      to: "Chilika",
      date: new Date(2025, 3, 17),
      departureTime: "07:00 AM",
      fare: 3500,
      availableSeats: 12,
      totalSeats: 18,
      busType: "Sleeper",
      imageUrl: "https://source.unsplash.com/random/600x400/?lake,nature"
    },
    {
      id: "3",
      title: "Explore Bhitarkanika",
      from: "Bhubaneswar",
      to: "Bhitarkanika",
      date: new Date(2025, 3, 18),
      departureTime: "06:30 AM",
      fare: 4000,
      availableSeats: 24,
      totalSeats: 36,
      busType: "Mixed",
      imageUrl: "https://source.unsplash.com/random/600x400/?forest,wildlife"
    }
  ];

  return (
    <PageLayout className="pb-12">
      {/* Hero Section */}
      <section className="relative h-[70vh] overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8 -mt-6">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://source.unsplash.com/random/1920x1080/?travel,bus)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
            Ananda Rath Travel Agency
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl animate-fade-in">
            Book tickets for premium bus trips across India as an agent and earn commissions on every booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
            <Button 
              size="lg" 
              onClick={() => navigate("/login")} 
              className="bg-rath-red hover:bg-rath-red/90"
            >
              Agent Login
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate("/register")}
              className="border-white text-white hover:bg-white/20"
            >
              Register as Agent
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Trips Section */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-2">Featured Trips</h2>
          <p className="text-gray-600 mb-8">Explore our most popular destinations</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredTrips.map(trip => (
              <TripCard key={trip.id} {...trip} />
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button onClick={() => navigate("/trips")}>View All Trips</Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-2 text-center">Why Book With Us</h2>
          <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">
            As an Ananda Rath agent, you get exclusive benefits and a seamless booking experience
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
                <div className="bg-rath-red/10 p-4 rounded-full mb-4">
                  <IndianRupee className="h-8 w-8 text-rath-red" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Earn Commissions</h3>
                <p className="text-gray-600">
                  Earn attractive commissions on every booking you make for your customers
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
                <div className="bg-rath-gold/10 p-4 rounded-full mb-4">
                  <Search className="h-8 w-8 text-rath-gold" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
                <p className="text-gray-600">
                  Simple seat selection, passenger details entry, and secure payment options
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-8 pb-6 flex flex-col items-center text-center">
                <div className="bg-rath-red/10 p-4 rounded-full mb-4">
                  <Calendar className="h-8 w-8 text-rath-red" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multiple Destinations</h3>
                <p className="text-gray-600">
                  Book trips to various popular destinations across the region
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Booking?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our agent network today and start earning commissions on every booking.
            It's quick, easy, and profitable!
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/register")} 
            className="bg-rath-red hover:bg-rath-red/90"
          >
            Become an Agent
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
