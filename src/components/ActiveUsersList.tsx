
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { UserRound, UserCheck, UserX } from "lucide-react";

interface User {
  id: string;
  full_name: string | null;
  user_type: string;
  status: 'active' | 'inactive';
}

const ActiveUsersList = ({ asSidebar = false }: { asSidebar?: boolean }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActive, setShowActive] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [showActive]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // In a real app, we would filter by status in the query
      // For now, we'll fetch all users and filter client-side
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      // Mock the status for demonstration
      const usersWithStatus = data.map(user => ({
        ...user,
        status: Math.random() > 0.3 ? 'active' : 'inactive',
      })) as User[];
      
      // Filter based on the current active/inactive selection
      const filteredUsers = showActive 
        ? usersWithStatus.filter(user => user.status === 'active')
        : usersWithStatus.filter(user => user.status === 'inactive');
      
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerClass = asSidebar 
    ? "bg-white h-full w-full overflow-auto flex flex-col" 
    : "bg-white p-6 rounded-lg shadow";

  return (
    <div className={containerClass}>
      <div className={`flex justify-between items-center ${asSidebar ? 'p-4 border-b' : 'mb-6'}`}>
        <h2 className={`font-bold text-gray-800 ${asSidebar ? 'text-lg' : 'text-2xl'}`}>
          {showActive ? 'Active Users' : 'Inactive Users'}
        </h2>
        <div className="flex gap-2">
          <Button 
            variant={showActive ? "default" : "outline"}
            onClick={() => setShowActive(true)}
            className={`${showActive ? "bg-green-500 hover:bg-green-600" : ""} ${asSidebar ? "h-8 px-2 py-1 text-xs" : ""}`}
            size={asSidebar ? "sm" : "default"}
          >
            <UserCheck className={`${asSidebar ? "h-3 w-3" : "h-4 w-4"} mr-1`} /> 
            Active
          </Button>
          <Button 
            variant={!showActive ? "default" : "outline"}
            onClick={() => setShowActive(false)}
            className={`${!showActive ? "bg-red-500 hover:bg-red-600" : ""} ${asSidebar ? "h-8 px-2 py-1 text-xs" : ""}`}
            size={asSidebar ? "sm" : "default"}
          >
            <UserX className={`${asSidebar ? "h-3 w-3" : "h-4 w-4"} mr-1`} /> 
            Inactive
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : users.length > 0 ? (
        <div className={`${asSidebar ? 'flex-1 overflow-auto p-2' : 'space-y-4'}`}>
          {users.map(user => (
            <div 
              key={user.id} 
              className={`flex items-center justify-between ${asSidebar ? 'p-2 mb-2' : 'p-4'} border rounded-lg hover:bg-gray-50`}
            >
              <div className="flex items-center gap-2">
                <div className="bg-gray-100 p-1.5 rounded-full">
                  <UserRound className={`${asSidebar ? 'h-4 w-4' : 'h-5 w-5'} text-gray-600`} />
                </div>
                <div>
                  <p className={`font-medium ${asSidebar ? 'text-sm' : ''}`}>{user.full_name || 'Unnamed User'}</p>
                  <p className={`${asSidebar ? 'text-xs' : 'text-sm'} text-gray-500`}>{user.user_type}</p>
                </div>
              </div>
              <div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500 text-sm">No {showActive ? 'active' : 'inactive'} users found</p>
        </div>
      )}
    </div>
  );
};

export default ActiveUsersList;
