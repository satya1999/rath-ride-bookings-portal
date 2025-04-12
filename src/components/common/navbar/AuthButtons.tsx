
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import UserDropdown from "./UserDropdown";

interface AuthButtonsProps {
  isMobile?: boolean;
  onActionComplete?: () => void;
}

const AuthButtons = ({ isMobile, onActionComplete }: AuthButtonsProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogin = () => {
    navigate("/login");
    if (onActionComplete) onActionComplete();
  };

  const handleRegister = () => {
    navigate("/register");
    if (onActionComplete) onActionComplete();
  };

  if (user) {
    if (isMobile) {
      return null; // Mobile user options are handled in MobileMenu
    }
    return (
      <div className="hidden md:flex md:items-center md:ml-6">
        <UserDropdown />
      </div>
    );
  }

  return (
    <div className={isMobile ? "flex flex-col space-y-2 mt-4" : "hidden md:flex md:space-x-2"}>
      <Button 
        variant="outline" 
        onClick={handleLogin}
        className={isMobile ? "w-full" : ""}
      >
        Login
      </Button>
      <Button 
        onClick={handleRegister}
        className={isMobile ? "w-full" : ""}
      >
        Register
      </Button>
    </div>
  );
};

export default AuthButtons;
