
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { UserCircle, User, LogOut } from "lucide-react";
import NavLink from "./NavLink";
import AuthButtons from "./AuthButtons";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden block border-t">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <NavLink 
          to="/" 
          isActive={isActivePath('/')}
          onClick={onClose}
          className="block px-3 py-2 rounded-md text-base font-medium"
        >
          Home
        </NavLink>
        <NavLink 
          to="/trips" 
          isActive={isActivePath('/trips')}
          onClick={onClose}
          className="block px-3 py-2 rounded-md text-base font-medium"
        >
          Trips
        </NavLink>
        <NavLink 
          to="/about" 
          isActive={isActivePath('/about')}
          onClick={onClose}
          className="block px-3 py-2 rounded-md text-base font-medium"
        >
          About Us
        </NavLink>
        <NavLink 
          to="/contact" 
          isActive={isActivePath('/contact')}
          onClick={onClose}
          className="block px-3 py-2 rounded-md text-base font-medium"
        >
          Contact
        </NavLink>
        
        <div className="flex items-center mt-2 px-3">
          <span className="text-sm mr-2">Theme:</span>
          <ThemeToggle />
        </div>
        
        {user ? (
          <div className="flex flex-col space-y-2 mt-4">
            <Button 
              onClick={() => handleNavigation('/profile')}
              className="w-full"
            >
              <UserCircle className="h-4 w-4 mr-2" /> My Profile
            </Button>
            <Button 
              onClick={() => handleNavigation('/dashboard')}
              className="w-full"
            >
              <User className="h-4 w-4 mr-2" /> Dashboard
            </Button>
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          </div>
        ) : (
          <AuthButtons isMobile={true} onActionComplete={onClose} />
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
