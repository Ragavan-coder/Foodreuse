import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Calendar, Phone, Mail, Image, Home, Building, MapPinIcon, X } from "lucide-react";
import { sendDonationEmail } from "@/utils/emailService";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DonationType = "Bakery" | "Restaurant" | "Grocery" | "Individual";

const DonationForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<DonationType>("Restaurant");
  const [expiryDate, setExpiryDate] = useState("");
  const [items, setItems] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, profile, isAuthenticated, refreshProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Set mobile from profile if available
    if (profile?.mobile) {
      setMobile(profile.mobile);
    }
    
    // Try to get current position
    getCurrentLocation();
  }, [profile]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
          setIsGettingLocation(false);
        },
        () => {
          toast({
            title: "Location error",
            description: "Unable to get your current location. Please enter coordinates manually.",
            variant: "destructive",
          });
          setIsGettingLocation(false);
        }
      );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to donate food",
        variant: "destructive",
      });
      navigate("/sign-in");
      return;
    }

    try {
      // Calculate expiry days from the expiry date
      const expiryDays = Math.ceil(
        (new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      );

      if (expiryDays <= 0) {
        throw new Error("Expiry date must be in the future");
      }

      // Update profile with mobile number if it has changed
      if (mobile && (!profile?.mobile || profile.mobile !== mobile)) {
        // Update the profile in a type-safe way
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            mobile: mobile,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (profileError) {
          console.error("Error updating profile:", profileError);
        } else {
          // Refresh the profile data
          await refreshProfile();
        }
      }

      // Format the full address
      const fullAddress = `${address}, ${city}, ${state} ${zipCode}`;

      // Store donation in Supabase
      const { data, error } = await supabase
        .from('donations')
        .insert([
          {
            donor_id: user.id,
            title,
            description,
            items: items.split(',').map(item => item.trim()),
            expiry_days: expiryDays,
            location: type,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            address: fullAddress,
            status: 'available'
          }
        ])
        .select();

      if (error) throw error;
      
      // Send email notification
      const emailResult = await sendDonationEmail({
        email: user.email,
        name: profile?.full_name || user.email,
        message: `Thank you for your food donation!
          
Donation Details:
Title: ${title}
Type: ${type}
Items: ${items}
Description: ${description}
Address: ${fullAddress}
Location: ${type} at coordinates (${latitude}, ${longitude})
Contact: ${mobile}
Expiry: ${new Date(expiryDate).toLocaleDateString()}
          
Your generosity helps reduce food waste and supports our community!`
      });
      
      if (emailResult) {
        toast({
          title: "Email notification sent",
          description: "You will receive a confirmation email with donation details"
        });
      }
      
      toast({
        title: "Thank you!",
        description: "Your donation has been successfully listed",
        variant: "default",
      });
      
      setTimeout(() => {
        navigate("/donations");
      }, 1500);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to list your donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Default location coordinates by type
  const getDefaultLocation = (locationType: DonationType) => {
    switch(locationType) {
      case "Bakery": 
        return { lat: "40.712776", lng: "-74.005974" };
      case "Restaurant": 
        return { lat: "40.715076", lng: "-74.009974" };
      case "Grocery": 
        return { lat: "40.710776", lng: "-74.002974" };
      case "Individual":
        return { lat: "40.713776", lng: "-74.006974" };
      default:
        return { lat: "", lng: "" };
    }
  };

  const handleTypeChange = (value: string) => {
    const type = value as DonationType;
    setType(type);
    
    // Only set default locations if the user hasn't already set their own
    if (!latitude || !longitude) {
      const defaultLocation = getDefaultLocation(type);
      setLatitude(defaultLocation.lat);
      setLongitude(defaultLocation.lng);
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Donate Food</h2>
        <p className="mt-2 text-lg text-gray-600">
          Share your excess food with those who need it
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Donation Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Assorted Pastries from Morning Bakery"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Food Source Type</Label>
            <Select value={type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bakery">Bakery</SelectItem>
                <SelectItem value="Restaurant">Restaurant</SelectItem>
                <SelectItem value="Grocery">Grocery</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the food you're donating, its condition, and any other relevant details."
            className="h-32"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="items">Food Items (comma separated)</Label>
            <Input
              id="items"
              value={items}
              onChange={(e) => setItems(e.target.value)}
              placeholder="e.g. Croissants, Muffins, Danish Pastries"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Expiry Date & Time
            </Label>
            <Input
              id="expiryDate"
              type="datetime-local"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Image upload section */}
        <div className="space-y-2">
          <Label htmlFor="foodImage" className="flex items-center gap-2">
            <Image className="h-4 w-4" /> Food Image
          </Label>
          <div className="flex flex-col gap-4">
            <Input
              id="foodImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border border-gray-300 rounded-md"
            />
            {imagePreview && (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Food preview" 
                  className="h-40 w-auto object-cover rounded-md"
                />
                <button 
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500">
              Upload an image of the food you are donating.
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="mobile" className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> Contact Phone Number
              </Label>
              <Input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="e.g. +1 (555) 123-4567"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Address Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <Home className="h-4 w-4" /> Street Address
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="123 Main St"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city" className="flex items-center gap-2">
                <Building className="h-4 w-4" /> City
              </Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="San Francisco"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="California"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="94105"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="flex justify-between">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Location Coordinates
            </span>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={getCurrentLocation}
              className="text-xs"
              disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <span className="flex items-center gap-1">
                  <div className="h-3 w-3 rounded-full border-t-2 border-blue-500 animate-spin"></div>
                  Getting Location...
                </span>
              ) : (
                "Get Current Location"
              )}
            </Button>
          </Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-lg py-6 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full border-t-2 border-b-2 border-white animate-spin"></div>
                Submitting Donation...
              </span>
            ) : (
              "Donate Food Now"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
