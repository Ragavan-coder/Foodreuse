
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FoodMap from "@/components/FoodMap";
import FindDonationSearch from "@/components/FindDonationSearch";
import DonationCard from "@/components/DonationCard";
import ActiveUsersList from "@/components/ActiveUsersList";

interface SearchFormValues {
  latitude: string;
  longitude: string;
  distance: string;
  foodType: string;
}

interface DonationResult {
  id: string;
  title: string;
  description: string;
  type: "Bakery" | "Restaurant" | "Grocery" | "Individual";
  distance: string;
  expiryDate: string;
  items: string[];
  imageUrl: string;
}

const FindDonations = () => {
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<DonationResult[]>([]);
  
  const handleSearch = (values: SearchFormValues) => {
    setIsSearching(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // In a real app, this would be an API call to fetch donations near the given coordinates
      const lat = parseFloat(values.latitude);
      const lng = parseFloat(values.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        setIsSearching(false);
        return;
      }
      
      const mockResults: DonationResult[] = [
        {
          id: "result1",
          title: "Fresh Baked Goods",
          description: "Assorted pastries and bread from today's baking that will not be sold tomorrow.",
          type: "Bakery",
          distance: `${(Math.random() * 2 + 0.2).toFixed(1)} miles`,
          expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          items: ["Croissants", "Bread", "Muffins", "Danish"],
          imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1740&q=80"
        },
        {
          id: "result2",
          title: "Restaurant Surplus",
          description: "End of day prepared meals that are still fresh but won't be served tomorrow.",
          type: "Restaurant",
          distance: `${(Math.random() * 2 + 0.2).toFixed(1)} miles`,
          expiryDate: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          items: ["Pasta", "Salad", "Soup", "Rice Dishes"],
          imageUrl: "https://images.unsplash.com/photo-1579684947550-22e945225d9a?auto=format&fit=crop&w=1740&q=80"
        },
        {
          id: "result3",
          title: "Grocery Overstock",
          description: "Fruits and vegetables that are still good but will be replaced with newer inventory tomorrow.",
          type: "Grocery",
          distance: `${(Math.random() * 2 + 0.2).toFixed(1)} miles`,
          expiryDate: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
          items: ["Apples", "Bananas", "Lettuce", "Tomatoes", "Peppers"],
          imageUrl: "https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=1740&q=80"
        }
      ];
      
      if (values.foodType) {
        setSearchResults(mockResults.filter(r => r.type === values.foodType));
      } else {
        setSearchResults(mockResults);
      }
      
      setSearchPerformed(true);
      setIsSearching(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Header */}
        <div className="bg-green-500 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Find Food Donations Near You
              </h1>
              <p className="mt-3 text-xl text-white opacity-90">
                Locate available donations in your community
              </p>
            </div>
          </div>
        </div>
        
        {/* Search and Map Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <FindDonationSearch onSearch={handleSearch} />
              </div>
              <div>
                <FoodMap />
              </div>
            </div>
          </div>
        </section>
        
        {/* Search Results */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {isSearching ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : searchPerformed ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {searchResults.length > 0 
                    ? `Found ${searchResults.length} donations near you` 
                    : "No donations found"}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((donation) => (
                    <DonationCard
                      key={donation.id}
                      {...donation}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Search for donations to see results</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Active Users Dashboard */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">User Activity Dashboard</h2>
            <ActiveUsersList />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default FindDonations;
