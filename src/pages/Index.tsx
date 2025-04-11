
import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import TripCard from "@/components/trips/TripCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MapPin } from "lucide-react";

// Mock feature data for the homepage
const features = [
  {
    title: "Easy Ticket Booking",
    description: "Book tickets for passengers with a simple, intuitive interface.",
    icon: "🎫"
  },
  {
    title: "Visual Seat Selection",
    description: "Select seats from a visual layout of the bus.",
    icon: "💺"
  },
  {
    title: "Earn Commissions",
    description: "Earn attractive commissions on every successful booking.",
    icon: "💰"
  },
  {
    title: "Track Your Bookings",
    description: "Monitor your bookings and commissions in real-time.",
    icon: "📊"
  }
];

// Mock testimonial data
const testimonials = [
  {
    quote: "Ananda Rath's agent portal has simplified my business operations. The commission structure is great!",
    author: "Rahul Sharma",
    role: "Travel Agent, Mumbai"
  },
  {
    quote: "I love how easy it is to book tickets and track my earnings. Best travel agent platform I've used!",
    author: "Priya Patel",
    role: "Tour Operator, Delhi"
  }
];

// Mock trips data for the featured trips section
const featuredTrips = [
  {
    id: "trip1",
    title: "Puri to Bhubaneswar",
    from: "Puri",
    to: "Bhubaneswar",
    date: new Date(2024, 3, 15),
    departureTime: "09:00 AM",
    fare: 399,
    availableSeats: 25,
    totalSeats: 30,
    busType: "Seater" as "Seater" | "Sleeper" | "Mixed",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "trip2",
    title: "Bhubaneswar to Konark",
    from: "Bhubaneswar",
    to: "Konark",
    date: new Date(2024, 3, 20),
    departureTime: "10:30 AM",
    fare: 450,
    availableSeats: 18,
    totalSeats: 30,
    busType: "Sleeper" as "Seater" | "Sleeper" | "Mixed",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "trip3",
    title: "Cuttack to Puri",
    from: "Cuttack",
    to: "Puri",
    date: new Date(2024, 3, 25),
    departureTime: "08:00 AM",
    fare: 500,
    availableSeats: 22,
    totalSeats: 30,
    busType: "Mixed" as "Seater" | "Sleeper" | "Mixed",
    imageUrl: "/placeholder.svg"
  }
];

const Index = () => {
  return (
    <PageLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rath-red/10 to-rath-gold/10 py-16 px-4 sm:py-24">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block text-rath-red">Ananda Rath</span>
            <span className="block">Agent Booking Portal</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Book tickets, earn commissions, and grow your travel business with Ananda Rath.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Button className="w-full px-8 py-3 md:py-4 md:text-lg md:px-10">
                Become an Agent
              </Button>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Button variant="outline" className="w-full px-8 py-3 md:py-4 md:text-lg md:px-10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-rath-red font-semibold tracking-wide uppercase">Benefits</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why become an Ananda Rath agent?
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {features.map((feature) => (
                <div key={feature.title} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-rath-red text-white">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.title}</p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Featured Trips Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-rath-red font-semibold tracking-wide uppercase">Featured Trips</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Popular Routes
            </p>
          </div>
          
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredTrips.map((trip) => (
              <TripCard 
                key={trip.id}
                id={trip.id}
                title={trip.title}
                from={trip.from}
                to={trip.to}
                date={trip.date}
                departureTime={trip.departureTime}
                fare={trip.fare}
                availableSeats={trip.availableSeats}
                totalSeats={trip.totalSeats}
                busType={trip.busType}
                imageUrl={trip.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-rath-red font-semibold tracking-wide uppercase">Testimonials</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              What Our Agents Say
            </p>
          </div>
          
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {testimonials.map((testimonial, idx) => (
              <div 
                key={idx} 
                className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-100"
              >
                <p className="text-lg italic text-gray-600">"{testimonial.quote}"</p>
                <div className="mt-4">
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-rath-red">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start earning?</span>
            <span className="block text-yellow-300">Become an Ananda Rath agent today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Button variant="secondary" size="lg">
                Register Now
              </Button>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Button variant="outline" className="bg-white text-rath-red hover:bg-gray-100" size="lg">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Index;
