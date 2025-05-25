
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type DonationType = "Bakery" | "Restaurant" | "Grocery" | "Individual";

interface DonationCardProps {
  id: string | number;
  title: string;
  description: string;
  type: DonationType;
  distance?: string;
  expiryDate: string;
  items: string[];
  imageUrl?: string;
  status?: string;
}

const DonationCard = ({
  id,
  title,
  description,
  type,
  distance,
  expiryDate,
  items,
  imageUrl = "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80",
  status,
}: DonationCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [requestStatus, setRequestStatus] = useState<"none" | "pending" | "confirmed" | "cancelled">("none");

  // Determine the color based on donation type
  const getTypeColor = (type: DonationType) => {
    switch (type) {
      case "Bakery":
        return "bg-yellow-100 text-yellow-800";
      case "Restaurant":
        return "bg-orange-100 text-orange-800";
      case "Grocery":
        return "bg-green-100 text-green-800";
      case "Individual":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate time remaining until expiry
  const calculateTimeRemaining = () => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 0) return "Expired";
    if (diffHours < 1) return "Less than 1 hour";
    if (diffHours < 24) return `${diffHours} hours`;
    return `${Math.floor(diffHours / 24)} days`;
  };

  const toggleZoom = () => {
    setZoomed(!zoomed);
    setExpanded(!expanded);
  };

  const handleRequest = () => {
    setRequestStatus("pending");
    toast({
      title: "Request Sent",
      description: "Your request has been sent to the donor.",
    });
  };

  const handleConfirm = () => {
    setRequestStatus("confirmed");
    toast({
      title: "Donation Confirmed",
      description: "This donation has been confirmed for pickup.",
    });
  };

  const handleCancel = () => {
    setRequestStatus("none");
    toast({
      title: "Request Cancelled",
      description: "Your request has been cancelled.",
    });
  };

  if (zoomed) {
    return (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={toggleZoom}>
        <Card className="bg-white w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
          <div className="relative h-60">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
                {type}
              </span>
            </div>
            {distance && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-90 text-gray-800">
                  {distance} away
                </span>
              </div>
            )}
          </div>
          
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            </div>
            
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{calculateTimeRemaining()} remaining</span>
            </div>
            
            <p className="mt-4 text-gray-600">
              {description}
            </p>
            
            {items.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900">Items:</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {items.map((item, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <Button onClick={toggleZoom}>Close</Button>
              
              {requestStatus === "none" && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="ml-2 bg-green-500 hover:bg-green-600">Request</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Request Donation</AlertDialogTitle>
                      <AlertDialogDescription>
                        Would you like to request this donation? This will notify the donor of your interest.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRequest}>Confirm</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
              
              {requestStatus === "pending" && (
                <div className="flex ml-2 gap-2">
                  <Button variant="outline" onClick={handleCancel}>Cancel Request</Button>
                  <Button className="bg-green-500 hover:bg-green-600" onClick={handleConfirm}>Confirm Pickup</Button>
                </div>
              )}
              
              {requestStatus === "confirmed" && (
                <Button className="ml-2 bg-gray-500 hover:bg-gray-600" disabled>Confirmed</Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg animate-fade-in">
      <div className="relative h-40">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
            {type}
          </span>
        </div>
        {distance && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-90 text-gray-800">
              {distance} away
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{title}</h3>
        </div>
        
        <div className="mt-1 flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>{calculateTimeRemaining()} remaining</span>
        </div>
        
        <p className={`mt-2 text-sm text-gray-600 ${expanded ? '' : 'line-clamp-2'}`}>
          {description}
        </p>
        
        {items.length > 0 && (
          <div className="mt-3">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Items:</h4>
            <div className="mt-1 flex flex-wrap gap-1">
              {items.slice(0, expanded ? items.length : 3).map((item, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {item}
                </span>
              ))}
              {!expanded && items.length > 3 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  +{items.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={toggleZoom}
            className="text-sm text-green-600 hover:text-green-700"
          >
            {expanded ? "Show less" : "Show more"}
          </button>
          
          {requestStatus === "none" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm">Request</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Request Donation</AlertDialogTitle>
                  <AlertDialogDescription>
                    Would you like to request this donation? This will notify the donor of your interest.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRequest}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          {requestStatus === "pending" && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleCancel}>Cancel</Button>
              <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={handleConfirm}>Confirm</Button>
            </div>
          )}
          
          {requestStatus === "confirmed" && (
            <Button size="sm" className="bg-gray-500 hover:bg-gray-600" disabled>Confirmed</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationCard;
