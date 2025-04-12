
import React from "react";
import { useLocation } from "react-router-dom";
import NavLink from "./NavLink";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const DesktopMenu = () => {
  const location = useLocation();

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
      <NavLink 
        to="/" 
        isActive={isActivePath('/')}
        className="px-3 py-2 rounded-md text-sm font-medium"
      >
        Home
      </NavLink>
      <NavLink 
        to="/trips" 
        isActive={isActivePath('/trips')}
        className="px-3 py-2 rounded-md text-sm font-medium"
      >
        Trips
      </NavLink>
      <NavLink 
        to="/about" 
        isActive={isActivePath('/about')}
        className="px-3 py-2 rounded-md text-sm font-medium"
      >
        About Us
      </NavLink>
      <NavLink 
        to="/contact" 
        isActive={isActivePath('/contact')}
        className="px-3 py-2 rounded-md text-sm font-medium"
      >
        Contact
      </NavLink>
      <ThemeToggle />
    </div>
  );
};

export default DesktopMenu;
