
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  // Mock authenticated state - will be replaced with actual auth
  const isAuthenticated = false;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-rath-red font-heading font-bold text-2xl">ANANDA</span>
              <span className="text-rath-gold font-heading font-bold text-2xl ml-1">RATH</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:text-rath-red transition-colors">Home</Link>
            <Link to="/trips" className="px-3 py-2 rounded-md text-sm font-medium hover:text-rath-red transition-colors">Trips</Link>
            <Link to="/about" className="px-3 py-2 rounded-md text-sm font-medium hover:text-rath-red transition-colors">About Us</Link>
            <Link to="/contact" className="px-3 py-2 rounded-md text-sm font-medium hover:text-rath-red transition-colors">Contact</Link>
          </div>
          
          {/* Auth buttons */}
          <div className="hidden md:flex md:items-center md:ml-6">
            {isAuthenticated ? (
              <Button onClick={handleDashboard} className="flex items-center">
                <User className="h-4 w-4 mr-2" /> Dashboard
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleLogin}>Login</Button>
                <Button onClick={handleRegister}>Register</Button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={cn("md:hidden", isMenuOpen ? "block" : "hidden")}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:text-rath-red transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link 
            to="/trips" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:text-rath-red transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Trips
          </Link>
          <Link 
            to="/about" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:text-rath-red transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            About Us
          </Link>
          <Link 
            to="/contact" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:text-rath-red transition-colors"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
          
          {isAuthenticated ? (
            <Button 
              onClick={() => { handleDashboard(); setIsMenuOpen(false); }} 
              className="w-full mt-4"
            >
              <User className="h-4 w-4 mr-2" /> Dashboard
            </Button>
          ) : (
            <div className="flex flex-col space-y-2 mt-4">
              <Button variant="outline" onClick={() => { handleLogin(); setIsMenuOpen(false); }}>
                Login
              </Button>
              <Button onClick={() => { handleRegister(); setIsMenuOpen(false); }}>
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
