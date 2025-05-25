
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserRound, LogOut } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/");
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-green-500 text-xl font-bold">Food</span>
              <span className="text-orange-500 text-xl font-bold">Rescue</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-green-500 hover:text-green-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              <Link
                to="/donations"
                className="border-transparent text-gray-500 hover:border-green-500 hover:text-green-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Donations
              </Link>
              <Link
                to="/about"
                className="border-transparent text-gray-500 hover:border-green-500 hover:text-green-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/donate"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  Donate Food
                </Link>
                <div className="relative">
                  <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-green-600">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium">{profile?.full_name || user?.email}</span>
                      <span className="text-xs text-gray-500">{profile?.user_type || "User"}</span>
                    </div>
                    <UserRound className="h-5 w-5" />
                  </Link>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-1" /> Sign Out
                </Button>
              </div>
            ) : (
              <div>
                <Button variant="outline" className="mr-2" onClick={() => navigate("/sign-in")}>
                  Sign In
                </Button>
                <Button onClick={() => navigate("/sign-up")}>Sign Up</Button>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="bg-green-50 border-green-500 text-green-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/donations"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Donations
            </Link>
            <Link
              to="/about"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            {isAuthenticated && (
              <Link
                to="/donate"
                className="border-transparent text-white bg-green-600 hover:bg-green-700 block pl-3 pr-4 py-2 text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Donate Food
              </Link>
            )}
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2 w-full">
                    <Link
                      to="/profile"
                      className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-700">{profile?.full_name || user?.email}</p>
                        <p className="text-xs text-gray-500">{profile?.user_type || "User"}</p>
                      </div>
                      <UserRound className="h-5 w-5 text-gray-500" />
                    </Link>
                    <Button 
                      onClick={handleSignOut} 
                      className="w-full"
                      variant="outline"
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2 w-full">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={() => {
                        navigate("/sign-in");
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        navigate("/sign-up");
                        setIsMenuOpen(false);
                      }}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
