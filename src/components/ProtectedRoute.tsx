
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    // Only redirect if auth has been checked and user is not authenticated
    if (!isLoading) {
      setHasCheckedAuth(true);
      
      if (!isAuthenticated) {
        console.log("Not authenticated, redirecting to sign-in");
        toast({
          title: "Authentication required",
          description: "Please sign in to access this page",
          variant: "destructive",
        });
        navigate("/sign-in");
      }
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Show loading state while authentication is being checked
  if (isLoading || !hasCheckedAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // Render children directly without the sidebar
  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
