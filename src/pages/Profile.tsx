
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import DonationCard from "@/components/DonationCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Phone, Mail, MapPin } from "lucide-react";

interface UserDonation {
  id: string;
  title: string;
  description: string | null;
  type: "Bakery" | "Restaurant" | "Grocery" | "Individual";
  distance?: string;
  expiryDate: string;
  items: string[];
  imageUrl?: string;
  status: string | null;
}

const Profile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [mobile, setMobile] = useState(profile?.mobile || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [userDonations, setUserDonations] = useState<UserDonation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setMobile(profile.mobile || "");
    }
  }, [profile]);

  useEffect(() => {
    const fetchUserDonations = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("donations")
          .select("*")
          .eq("donor_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching donations:", error);
          return;
        }

        // Transform data to match DonationCard props
        const formattedDonations = data.map(donation => ({
          id: donation.id,
          title: donation.title,
          description: donation.description,
          type: donation.location as "Bakery" | "Restaurant" | "Grocery" | "Individual",
          expiryDate: new Date(Date.now() + donation.expiry_days * 24 * 60 * 60 * 1000).toISOString(),
          items: donation.items,
          status: donation.status,
          imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
        }));

        setUserDonations(formattedDonations);
      } catch (err) {
        console.error("Error in fetchUserDonations:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDonations();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          mobile: mobile,
          updated_at: new Date().toISOString()
        })
        .eq("id", user.id);
        
      if (error) throw error;
      
      await refreshProfile();
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <div className="bg-green-500 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                My Profile
              </h1>
              <p className="mt-3 text-xl text-white opacity-90">
                Manage your account and view your donations
              </p>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <User className="h-12 w-12 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold">{profile?.full_name || user?.email}</h2>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-sm font-medium text-green-800 mt-1">
                    {profile?.user_type === "donor" ? "Food Donor" : "Food Recipient"}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-gray-500">
                    <Mail className="h-5 w-5 mt-0.5" />
                    <span>{user?.email}</span>
                  </div>
                  {profile?.mobile && (
                    <div className="flex items-start gap-3 text-gray-500">
                      <Phone className="h-5 w-5 mt-0.5" />
                      <span>{profile.mobile}</span>
                    </div>
                  )}
                </div>
                
                <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <Input
                      id="mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="Your contact number"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-green-500 hover:bg-green-600"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Updating..." : "Update Profile"}
                  </Button>
                </form>
              </div>
            </div>
            
            {/* User Donations */}
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-6">My Donations</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : userDonations.length > 0 ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userDonations.map(donation => (
                      <DonationCard
                        key={donation.id}
                        {...donation}
                      />
                    ))}
                  </div>
                  
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Expiry</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userDonations.map(donation => (
                          <TableRow key={donation.id}>
                            <TableCell className="font-medium">{donation.title}</TableCell>
                            <TableCell>{donation.type}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                donation.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {donation.status || 'N/A'}
                              </span>
                            </TableCell>
                            <TableCell>
                              {new Date(donation.expiryDate).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                  <div className="mx-auto h-20 w-20 text-gray-300">
                    <MapPin className="h-20 w-20" />
                  </div>
                  <h3 className="mt-2 text-xl font-semibold text-gray-900">No donations yet</h3>
                  <p className="mt-1 text-gray-500">
                    You haven't listed any food donations yet. Start sharing your excess food with those who need it.
                  </p>
                  <div className="mt-6">
                    <Button 
                      className="bg-green-500 hover:bg-green-600"
                      onClick={() => window.location.href = '/donate'}
                    >
                      Donate Food
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
