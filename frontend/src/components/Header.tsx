import { FC } from "react";
import { Link } from "react-router-dom";

const Header: FC = () => {
  return (
    <div className="bg-pink-300 p-2 flex justify-between">
      <div className="flex gap-4">
        <Link to="/">HOME</Link>
        <Link to="/my">MY</Link>
        <Link to="/sale">SALE</Link>
      </div>
      <div>
        <button>MetaMask Login</button>
      </div>
    </div>
  );
};

export default Header;
