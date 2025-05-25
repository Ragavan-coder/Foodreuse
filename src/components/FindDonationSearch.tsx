
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Search, Filter, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";

interface FindDonationFormValues {
  latitude: string;
  longitude: string;
  distance: string;
  foodType: string;
}

interface FindDonationSearchProps {
  onSearch: (values: FindDonationFormValues) => void;
}

const FindDonationSearch = ({ onSearch }: FindDonationSearchProps) => {
  const [advancedSearch, setAdvancedSearch] = useState(false);
  
  const form = useForm<FindDonationFormValues>({
    defaultValues: {
      latitude: '',
      longitude: '',
      distance: '5',
      foodType: ''
    }
  });
  
  const onSubmit = (data: FindDonationFormValues) => {
    toast({
      title: "Searching for donations",
      description: `Looking for donations at coordinates ${data.latitude}, ${data.longitude}`
    });
    
    onSearch(data);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Find Food Donations</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Latitude</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter latitude (e.g. 40.712776)" 
                      {...field} 
                      className="flex-grow"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Longitude</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter longitude (e.g. -74.005974)" 
                      {...field} 
                      className="flex-grow"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="ghost"
              className="text-green-600 hover:text-green-700 p-0"
              onClick={() => {
                if (navigator.geolocation) {
                  toast({
                    title: "Detecting location",
                    description: "Getting your current location..."
                  });
                  
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      form.setValue('latitude', position.coords.latitude.toString());
                      form.setValue('longitude', position.coords.longitude.toString());
                      toast({
                        title: "Location detected",
                        description: "Using your current location"
                      });
                    },
                    () => {
                      toast({
                        title: "Location error",
                        description: "Unable to get your location",
                        variant: "destructive"
                      });
                    }
                  );
                }
              }}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Use Current Location
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              className="text-green-600 hover:text-green-700 p-0"
              onClick={() => setAdvancedSearch(!advancedSearch)}
            >
              <Filter className="h-4 w-4 mr-1" />
              {advancedSearch ? "Hide filters" : "Show filters"}
            </Button>
          </div>
          
          {advancedSearch && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distance</FormLabel>
                    <FormControl>
                      <select
                        className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        {...field}
                      >
                        <option value="1">Within 1 mile</option>
                        <option value="5">Within 5 miles</option>
                        <option value="10">Within 10 miles</option>
                        <option value="25">Within 25 miles</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="foodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food Type</FormLabel>
                    <FormControl>
                      <select
                        className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500"
                        {...field}
                      >
                        <option value="">All Types</option>
                        <option value="Bakery">Bakery</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Grocery">Grocery</option>
                        <option value="Individual">Individual</option>
                      </select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          )}
          
          <div className="flex justify-end">
            <Button type="submit" className="bg-green-500 hover:bg-green-600">
              <Search className="h-4 w-4 mr-2" />
              Find Donations
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default FindDonationSearch;
