import "./navigation.css";
import { Link, useLocation } from "react-router-dom";
import logo from "../../images/logo icon and text.svg";
import { useState } from "react";
import { FaAlignJustify } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const Navigation: React.FC = () => {
  const location = useLocation();

  const [showMenu, setShowMenu] = useState(false);

  const openMenu = () => {
    setShowMenu(true);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <div>
      <nav className="nav-bar">
        <div className="logo-container">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </div>
        <FaAlignJustify className="open-menu" onClick={openMenu} />
        <ul className={`main-menu ${showMenu ? "active" : ""}`}>
          <li>
            <Link
              to="/"
              className={`menu-list-item ${
                location.pathname === "/" ? "active-link" : ""
              }`}
            >
              STRONA GŁÓWNA
            </Link>
          </li>
          <li>
            <Link
              to="/cennik"
              className={`menu-list-item ${
                location.pathname === "/cennik" ? "active-link" : ""
              }`}
            >
              CENNIK
            </Link>
          </li>
          <li>
            <Link
              to="/rezerwacja"
              className={`menu-list-item ${
                location.pathname === "/rezerwacja" ? "active-link" : ""
              }`}
            >
              REZERWACJA
            </Link>
          </li>
          <li>
            <Link
              to="/regulamin"
              className={`menu-list-item ${
                location.pathname === "/regulamin" ? "active-link" : ""
              }`}
            >
              WARUNKI WYNAJMU
            </Link>
          </li>
          <IoClose className="close-menu" onClick={closeMenu} />
        </ul>
      </nav>
    </div>
  );
};

export default Navigation;
