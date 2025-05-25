
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const UserSidebar = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const handleJoinClick = () => {
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }
    
    // User confirmed, proceed with joining
    window.open("https://chat.whatsapp.com/DkDsD4kq2olISxiogND1BC", "_blank");
    setHasJoined(true);
    setShowConfirmation(false);
    
    toast({
      title: "Success!",
      description: "You've joined the FoodRescue community!",
    });
  };

  const resetState = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="h-full border-l bg-white w-64 hidden lg:block">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-6">
            <div className="p-4 bg-green-50 rounded-lg text-center">
              {showConfirmation ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">Join our WhatsApp community?</p>
                  <div className="flex gap-2">
                    <Button 
                      className="bg-green-500 hover:bg-green-600 flex-1 flex items-center justify-center"
                      onClick={handleJoinClick}
                    >
                      <Check className="mr-2" size={18} />
                      Confirm
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1"
                      onClick={resetState}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <Button 
                    className={`${hasJoined ? 'bg-green-700' : 'bg-green-500 hover:bg-green-600'} w-full flex items-center justify-center`}
                    onClick={handleJoinClick}
                  >
                    <UserPlus className="mr-2" size={18} />
                    {hasJoined ? 'Joined Community' : 'Join Community'}
                  </Button>
                  <p className="mt-3 text-xs text-green-600">
                    Connect with others who are passionate about reducing food waste
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
