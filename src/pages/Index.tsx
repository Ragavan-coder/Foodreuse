import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import FoodMap from "@/components/FoodMap";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import DonationCard from "@/components/DonationCard";
import { supabase } from "@/integrations/supabase/client";

interface Donation {
  id: string;
  title: string;
  description: string | null;
  type: "Bakery" | "Restaurant" | "Grocery" | "Individual";
  distance: string;
  expiryDate: string;
  items: string[];
  imageUrl: string;
}

// Sample images for different donation types
const typeImages = {
  "Bakery": "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
  "Restaurant": "https://images.unsplash.com/photo-1579684947550-22e945225d9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
  "Grocery": "https://images.unsplash.com/photo-1610348725531-843dff563e2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
  "Individual": "https://images.unsplash.com/photo-1592419391068-9bd09e10990d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
};

const Index = () => {
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentDonations = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("donations")
          .select("*")
          .eq("status", "available")
          .order("created_at", { ascending: false })
          .limit(3);
          
        if (error) {
          console.error("Error fetching recent donations:", error);
          return;
        }
        
        // Transform database data to match our component props
        const formattedDonations = data.map(item => {
          // Calculate a random distance for demo purposes
          const distance = (Math.random() * 2 + 0.5).toFixed(1) + " miles";
          
          // Calculate expiry date from expiry_days
          const expiryDate = new Date(Date.now() + item.expiry_days * 24 * 60 * 60 * 1000).toISOString();
          
          return {
            id: item.id,
            title: item.title,
            description: item.description,
            type: item.location as "Bakery" | "Restaurant" | "Grocery" | "Individual",
            distance,
            expiryDate,
            items: item.items,
            imageUrl: typeImages[item.location as keyof typeof typeImages] || "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
          };
        });
        
        setRecentDonations(formattedDonations);
      } catch (err) {
        console.error("Error in fetchRecentDonations:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentDonations();
  }, []);

  const handleRegisterAsDonor = () => {
    navigate("/sign-up", { state: { userType: "donor" } });
  };
  
  const handleRegisterAsCharity = () => {
    navigate("/sign-up", { state: { userType: "recipient" } });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <Features />
        
        {/* Map Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Find Food Donations Near You</h2>
              <p className="mt-4 text-lg text-gray-600">
                Explore our interactive map to discover available food donations in your area.
                Connect with local businesses and individuals who are making a difference.
              </p>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <FoodMap />
            </div>
          </div>
        </section>
        
        {/* Recent Donations Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Recent Donations</h2>
              <p className="mt-4 text-lg text-gray-600">
                Browse recently added donations in your community.
                Act quickly to rescue food before it goes to waste!
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : recentDonations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {recentDonations.map((donation) => (
                  <DonationCard
                    key={donation.id}
                    {...donation}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No donations available at the moment. Check back soon!</p>
              </div>
            )}
            
            <div className="mt-12 text-center">
              <Button className="bg-green-500 hover:bg-green-600" asChild>
                <a href="/donations">See All Donations</a>
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-green-500 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white">Ready to Make a Difference?</h2>
              <p className="mt-4 text-lg text-white opacity-90">
                Join our growing community of food donors and recipients to help reduce food waste
                and fight hunger in your local community.
              </p>
              <div className="mt-10 flex justify-center gap-4 flex-wrap">
                <Button 
                  className="bg-white text-green-600 hover:bg-gray-100"
                  onClick={handleRegisterAsDonor}
                >
                  Register as Donor
                </Button>
                <Button 
                  className="bg-orange-500 text-white hover:bg-orange-600"
                  onClick={handleRegisterAsCharity}
                >
                  Register as Charity
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

export default Index;
