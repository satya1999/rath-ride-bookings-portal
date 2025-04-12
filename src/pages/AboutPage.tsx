
import PageLayout from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Map, Heart, Bus, Phone, Mail } from "lucide-react";

const AboutPage = () => {
  return (
    <PageLayout>
      <div className="space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">About Ananda Rath</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Specializing in comfortable and spiritual pilgrimage journeys across India since 2010
          </p>
        </div>

        {/* Our Story Section */}
        <Card>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Story</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    Ananda Rath was founded in 2010 with a simple mission: to make 
                    pilgrimages accessible, comfortable and spiritually enriching for 
                    every devotee.
                  </p>
                  <p>
                    What started as a small family business with just two buses 
                    connecting Bhubaneswar to Puri has now grown into a trusted 
                    pilgrimage travel service operating across the length and 
                    breadth of India.
                  </p>
                  <p>
                    Our founder, Shri Ramesh Panda, himself a devout pilgrim, recognized 
                    the challenges faced by travelers during religious journeys and 
                    decided to create a service that addresses these concerns while 
                    maintaining the sanctity of the pilgrimage experience.
                  </p>
                </div>
              </div>
              <div className="bg-gray-100 h-64 md:h-full rounded-lg flex items-center justify-center">
                <img 
                  src="https://source.unsplash.com/random/600x400/?temple" 
                  alt="Hindu temple" 
                  className="rounded-lg object-cover h-full w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Our Values */}
        <div className="py-10">
          <h2 className="text-3xl font-bold text-center mb-10">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="flex flex-col items-center text-center p-6">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Devotee Comfort</h3>
              <p className="text-gray-600">
                We prioritize the comfort and safety of our pilgrims, ensuring a pleasant 
                and worry-free journey to sacred destinations.
              </p>
            </Card>

            <Card className="flex flex-col items-center text-center p-6">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Spiritual Respect</h3>
              <p className="text-gray-600">
                We honor the spiritual significance of each pilgrimage and help our 
                travelers maintain the sanctity of their journey.
              </p>
            </Card>

            <Card className="flex flex-col items-center text-center p-6">
              <div className="bg-purple-100 p-4 rounded-full mb-4">
                <Map className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Local Knowledge</h3>
              <p className="text-gray-600">
                Our guides are deeply familiar with the religious and cultural significance 
                of each destination, enriching your pilgrimage experience.
              </p>
            </Card>
          </div>
        </div>

        {/* Our Services */}
        <div className="py-10">
          <h2 className="text-3xl font-bold text-center mb-10">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Bus className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Comfortable Transportation</h3>
                  <p className="text-gray-600">
                    Our fleet of modern AC and non-AC buses are designed for comfort during 
                    long journeys, with experienced drivers who know the routes well.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Map className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Guided Tours</h3>
                  <p className="text-gray-600">
                    Knowledgeable guides accompany each trip, providing insights into the 
                    religious significance and history of each sacred site.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Heart className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Accommodation & Meals</h3>
                  <p className="text-gray-600">
                    Clean and convenient accommodations at dharamshalas and hotels, with 
                    vegetarian meals prepared following traditional customs.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                  <p className="text-gray-600">
                    Our team is available around the clock to assist with any concerns 
                    during your journey, ensuring peace of mind.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Contact Info Preview */}
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold">Get in Touch</h2>
              <p className="text-gray-600">
                Have questions about our pilgrimage packages or need assistance planning your journey?
              </p>
              <div className="flex justify-center gap-8">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-purple-600" />
                  <span>+91 98765-43210</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <span>info@anandarath.com</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default AboutPage;
