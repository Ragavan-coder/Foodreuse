
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DonationCard from "@/components/DonationCard";
import { supabase } from "@/integrations/supabase/client";

// Type definitions for our donation data
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

const Donations = () => {
  const [filterType, setFilterType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"distance" | "expiry">("distance");
  const [searchQuery, setSearchQuery] = useState("");
  const [allDonations, setAllDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllDonations = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("donations")
          .select("*")
          .eq("status", "available")
          .order("created_at", { ascending: false });
          
        if (error) {
          console.error("Error fetching donations:", error);
          return;
        }
        
        // Transform database data to match our component props
        const formattedDonations = data.map(item => {
          // Calculate a random distance for demo purposes
          const distance = (Math.random() * 3 + 0.5).toFixed(1) + " miles";
          
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
            imageUrl: typeImages[item.location as keyof typeof typeImages] || typeImages["Bakery"]
          };
        });
        
        setAllDonations(formattedDonations);
      } catch (err) {
        console.error("Error in fetchAllDonations:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllDonations();
  }, []);

  const filteredDonations = allDonations
    .filter((donation) => 
      (!filterType || donation.type === filterType) &&
      (searchQuery === "" || 
        donation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        donation.items.some(item => item.toLowerCase().includes(searchQuery.toLowerCase())))
    )
    .sort((a, b) => {
      if (sortBy === "distance") {
        return parseFloat(a.distance) - parseFloat(b.distance);
      } else {
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
    });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Donations Header */}
        <div className="bg-green-500 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Available Food Donations
              </h1>
              <p className="mt-3 text-xl text-white opacity-90">
                Browse and claim food donations in your area
              </p>
            </div>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setFilterType(null)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterType === null
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("Restaurant")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterType === "Restaurant"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Restaurant
                </button>
                <button
                  onClick={() => setFilterType("Bakery")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterType === "Bakery"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Bakery
                </button>
                <button
                  onClick={() => setFilterType("Grocery")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterType === "Grocery"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Grocery
                </button>
                <button
                  onClick={() => setFilterType("Individual")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterType === "Individual"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  Individual
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search donations..."
                    className="pl-3 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                  </div>
                </div>
                
                <select
                  className="border rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "distance" | "expiry")}
                >
                  <option value="distance">Sort by Distance</option>
                  <option value="expiry">Sort by Expiry</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Donations Grid */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : filteredDonations.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDonations.map((donation) => (
                  <DonationCard
                    key={donation.id}
                    {...donation}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No donations found</h3>
                <p className="mt-2 text-gray-500">
                  Try adjusting your filters or search query to find more donations.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Donations;
