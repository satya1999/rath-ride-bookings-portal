
import { Link } from "react-router-dom";

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const NavLink = ({ to, isActive, children, onClick, className = "" }: NavLinkProps) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`${className} ${
        isActive ? 'text-rath-red' : 'hover:text-rath-red'
      } transition-colors`}
    >
      {children}
    </Link>
  );
};

export default NavLink;
