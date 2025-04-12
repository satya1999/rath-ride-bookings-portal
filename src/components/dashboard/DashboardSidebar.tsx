
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
  
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
  
  // Check if a path is active
  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      // For dashboard, check that we're on the dashboard route and not a specific tab
      return location.pathname === '/dashboard' && !location.search.includes('tab=');
    } else if (path === '/dashboard?tab=commissions') {
      // For earnings, check if we're on the commissions tab
      return location.pathname === '/dashboard' && location.search.includes('tab=commissions');
    } else {
      // For other routes, just check the pathname
      return location.pathname === path;
    }
  };
  
  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close menu" : "Open menu"}
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
                className={`flex items-center px-3 py-2 rounded-md transition-colors ${
                  isActivePath(item.path) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent'
                }`}
                onClick={() => setIsOpen(false)}
                aria-current={isActivePath(item.path) ? 'page' : undefined}
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
