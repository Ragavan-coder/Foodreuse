
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

// Mock data for the map
const mockDonations = [
  {
    id: "1",
    name: "Fresh Harvest Bakery",
    lat: 40.712776,
    lng: -74.005974,
    type: "Bakery",
    items: ["Bread", "Pastries", "Cakes"],
    expiryDate: "2025-05-16T18:00:00"
  },
  {
    id: "2",
    name: "Green Garden Restaurant",
    lat: 40.715076,
    lng: -74.009974,
    type: "Restaurant",
    items: ["Prepared Meals", "Vegetables", "Rice"],
    expiryDate: "2025-05-16T20:00:00"
  },
  {
    id: "3",
    name: "Farmhouse Market",
    lat: 40.710776,
    lng: -74.002974,
    type: "Grocery",
    items: ["Fruits", "Vegetables", "Dairy"],
    expiryDate: "2025-05-17T12:00:00"
  }
];

interface LocationInputProps {
  onSearch: (lat: string, lng: string) => void;
}

const LocationInput = ({ onSearch }: LocationInputProps) => {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (lat && lng) {
      onSearch(lat, lng);
    } else {
      toast({
        title: "Missing coordinates",
        description: "Please enter both latitude and longitude values",
        variant: "destructive"
      });
    }
  };
  
  return (
    <form onSubmit={handleSearch} className="flex gap-2 w-full">
      <Input 
        placeholder="Latitude" 
        value={lat}
        type="number"
        step="any"
        onChange={(e) => setLat(e.target.value)}
        className="flex-grow"
      />
      <Input 
        placeholder="Longitude" 
        value={lng}
        type="number"
        step="any"
        onChange={(e) => setLng(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit" className="bg-green-500 hover:bg-green-600">
        <Search className="h-4 w-4 mr-1" />
        Show
      </Button>
    </form>
  );
};

const FoodMap = () => {
  const [selectedDonation, setSelectedDonation] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState({ lat: 40.712776, lng: -74.005974 });
  const mapRef = useRef<HTMLIFrameElement | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapCoordinates, setMapCoordinates] = useState({ lat: 40.712776, lng: -74.005974 });
  const [filterActive, setFilterActive] = useState(false);
  const [filterType, setFilterType] = useState<string | null>(null);

  const handleMarkerClick = (id: string) => {
    setSelectedDonation(id === selectedDonation ? null : id);
    
    // Find the donation and update map coordinates
    const donation = mockDonations.find(d => d.id === id);
    if (donation) {
      setMapCoordinates({ lat: donation.lat, lng: donation.lng });
      updateMap(donation.lat, donation.lng);
    }
  };

  // Updates the map with new coordinates
  const updateMap = (lat: number, lng: number) => {
    if (mapRef.current) {
      const mapUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
      mapRef.current.src = mapUrl;
    }
  };

  // Handle location search
  const handleLocationSearch = (lat: string, lng: string) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (!isNaN(latitude) && !isNaN(longitude)) {
      toast({
        title: "Searching for donations",
        description: `Finding food donations at coordinates ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      });
      
      setMapCoordinates({ lat: latitude, lng: longitude });
      updateMap(latitude, longitude);
    }
  };

  const toggleFilter = (type: string | null) => {
    if (filterType === type) {
      setFilterType(null);
    } else {
      setFilterType(type);
      toast({
        title: "Filter applied",
        description: `Showing ${type} donations only`
      });
    }
  };

  // Gets user's location if they permit it
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(newLocation);
          setMapCoordinates(newLocation);
          
          // Initialize map with user location
          if (!mapInitialized) {
            updateMap(newLocation.lat, newLocation.lng);
            setMapInitialized(true);
          }
        },
        () => {
          console.log("Unable to retrieve your location");
          // Initialize map with default location if can't get user location
          if (!mapInitialized) {
            updateMap(userLocation.lat, userLocation.lng);
            setMapInitialized(true);
          }
        }
      );
    } else {
      // Initialize map with default location if geolocation not supported
      if (!mapInitialized) {
        updateMap(userLocation.lat, userLocation.lng);
        setMapInitialized(true);
      }
    }
  }, [mapInitialized, userLocation.lat, userLocation.lng]);

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-green-50">
        <h3 className="text-lg font-medium text-green-800">Find Food Donations Nearby</h3>
        <p className="text-green-600 mb-4">Enter coordinates to see donations</p>
        
        <LocationInput onSearch={handleLocationSearch} />
      </div>

      {/* Google Maps integration */}
      <div className="relative w-full h-96 bg-gray-100 border-t border-gray-200">
        <iframe 
          ref={mapRef}
          className="w-full h-full border-0"
          loading="lazy" 
          allowFullScreen
          title="Google Maps"
          aria-label="Google Maps showing food donation locations"
        ></iframe>
        
        {/* Donation markers that float on top of the map */}
        <div className="absolute inset-0 pointer-events-none">
          {mockDonations
            .filter(donation => !filterType || donation.type === filterType)
            .map((donation) => (
              <div 
                key={donation.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto ${
                  selectedDonation === donation.id ? 'z-20' : 'z-10'
                }`}
                style={{ 
                  top: `${30 + (donation.lat - userLocation.lat) * 500}%`, 
                  left: `${50 + (donation.lng - userLocation.lng) * 500}%`
                }}
                onClick={() => handleMarkerClick(donation.id)}
              >
                <div className={`w-6 h-6 rounded-full ${
                  donation.type === 'Restaurant' ? 'bg-orange-500' : 
                  donation.type === 'Bakery' ? 'bg-yellow-500' : 'bg-green-500'
                } flex items-center justify-center text-white text-xs font-bold shadow-md`}>
                  {donation.type.charAt(0)}
                </div>

                {selectedDonation === donation.id && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-white rounded-md shadow-lg z-30 p-3 pointer-events-auto">
                    <h4 className="font-bold text-gray-800">{donation.name}</h4>
                    <p className="text-xs text-gray-500 mb-1">{donation.type}</p>
                    <p className="text-xs font-medium mb-1">Available items:</p>
                    <ul className="text-xs text-gray-600 mb-2">
                      {donation.items.map((item, i) => (
                        <li key={i}>• {item}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-500">
                      Expires: {new Date(donation.expiryDate).toLocaleString()}
                    </p>
                    <button className="mt-2 w-full text-xs bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition-colors">
                      Request This Donation
                    </button>
                  </div>
                )}
              </div>
            ))}

          {/* User location marker */}
          <div
            className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
            style={{ 
              top: `30%`, 
              left: `50%` 
            }}
          >
            <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-md flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex space-x-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm"
              className={`flex items-center gap-1 ${filterActive ? 'border-green-500 text-green-700' : ''}`}
              onClick={() => setFilterActive(!filterActive)}
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            
            {filterActive && (
              <>
                <Button 
                  size="sm"
                  variant="outline"
                  className={filterType === "Restaurant" ? "bg-orange-100 text-orange-800 border-orange-300" : ""}
                  onClick={() => toggleFilter("Restaurant")}
                >
                  Restaurant
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  className={filterType === "Bakery" ? "bg-yellow-100 text-yellow-800 border-yellow-300" : ""}
                  onClick={() => toggleFilter("Bakery")}
                >
                  Bakery
                </Button>
                <Button 
                  size="sm"
                  variant="outline"
                  className={filterType === "Grocery" ? "bg-green-100 text-green-800 border-green-300" : ""}
                  onClick={() => toggleFilter("Grocery")}
                >
                  Grocery
                </Button>
              </>
            )}
          </div>
          <Button 
            size="sm"
            className="bg-green-500 hover:bg-green-600"
            onClick={() => updateMap(mapCoordinates.lat, mapCoordinates.lng)}
          >
            Refresh Map
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FoodMap;
