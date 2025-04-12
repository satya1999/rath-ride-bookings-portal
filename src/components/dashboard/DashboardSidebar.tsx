
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Ticket,
  CircleDollarSign,
  LogOut,
  Menu,
  X,
  User
} from "lucide-react";

const DashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const menuItems = [
    { icon: <LayoutDashboard className="mr-2 h-4 w-4" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Ticket className="mr-2 h-4 w-4" />, label: 'My Bookings', path: '/trips' },
    { icon: <CircleDollarSign className="mr-2 h-4 w-4" />, label: 'Earnings', path: '/dashboard?tab=commissions' },
    { icon: <User className="mr-2 h-4 w-4" />, label: 'My Profile', path: '/profile' }
  ];
  
  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out z-40 
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Agent Portal</h2>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item, index) => (
              <Link 
                key={index}
                to={item.path}
                className="flex items-center px-3 py-2 rounded-md hover:bg-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          
          {/* Logout Button */}
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start text-destructive hover:text-destructive"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;
