
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import NavLogo from "./navbar/NavLogo";
import DesktopMenu from "./navbar/DesktopMenu";
import AuthButtons from "./navbar/AuthButtons";
import MobileMenuToggle from "./navbar/MobileMenuToggle";
import MobileMenu from "./navbar/MobileMenu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-background shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <NavLogo />
          </div>
          
          {/* Desktop Navigation */}
          <DesktopMenu />
          
          {/* Auth Buttons */}
          <AuthButtons />
          
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <MobileMenuToggle 
              isOpen={isMenuOpen} 
              onClick={toggleMenu} 
            />
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {(isMenuOpen || (isMobile && isMenuOpen)) && (
        <div 
          id="mobile-menu"
          className="md:hidden"
        >
          <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
