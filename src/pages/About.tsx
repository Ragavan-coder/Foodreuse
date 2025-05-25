
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-green-500 py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                About FoodRescue
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-white opacity-90">
                Our mission is to reduce food waste and feed communities by connecting 
                those with excess food to those who need it most.
              </p>
            </div>
          </div>
        </div>
        
        {/* Impact Stats */}
        <section className="py-16 bg-green-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Our Impact</h2>
              <p className="mt-4 text-lg text-gray-600">
                Every donation makes a difference. Here's what we've accomplished together so far.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-4xl font-bold text-green-500">5,280</p>
                <p className="mt-2 text-sm text-gray-600 uppercase font-medium">Donations Made</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-4xl font-bold text-green-500">12,400</p>
                <p className="mt-2 text-sm text-gray-600 uppercase font-medium">Meals Provided</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-4xl font-bold text-green-500">320</p>
                <p className="mt-2 text-sm text-gray-600 uppercase font-medium">Active Organizations</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <p className="text-4xl font-bold text-green-500">4.2 tons</p>
                <p className="mt-2 text-sm text-gray-600 uppercase font-medium">Food Waste Prevented</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
              <p className="mt-4 text-lg text-gray-600">
                FoodRescue makes it easy to donate or receive food in your community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-500 text-2xl font-bold mb-4">1</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">List Donations</h3>
                <p className="text-gray-600">
                  Businesses and individuals list their excess food, including details about quantity, 
                  type, and when it needs to be picked up.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-500 text-2xl font-bold mb-4">2</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Connect</h3>
                <p className="text-gray-600">
                  Charitable organizations and community groups browse donations and request items 
                  they can use to feed those in need.
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-500 text-2xl font-bold mb-4">3</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">Rescue</h3>
                <p className="text-gray-600">
                  The food is picked up and distributed to those who need it most, preventing waste 
                  and feeding the community.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact CTA */}
        <section className="py-16 bg-green-500">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white">Join Our Community</h2>
              <p className="mt-4 text-lg text-white opacity-90">
                Connect with others who are passionate about reducing food waste and fighting hunger.
              </p>
              <div className="mt-8">
                <Button 
                  className="bg-white text-green-600 hover:bg-gray-100"
                  onClick={() => window.open("https://chat.whatsapp.com/DkDsD4kq2olISxiogND1BC", "_blank")}
                >
                  Join WhatsApp Community
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
