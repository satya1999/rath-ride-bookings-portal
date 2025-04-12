
import { Link } from "react-router-dom";

const NavLogo = () => {
  return (
    <Link to="/" className="flex-shrink-0 flex items-center">
      <span className="text-rath-red font-heading font-bold text-2xl">ANANDA</span>
      <span className="text-rath-gold font-heading font-bold text-2xl ml-1">RATH</span>
    </Link>
  );
};

export default NavLogo;
