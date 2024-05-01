import "./navigationComponent.css";
import { Link, useLocation } from "react-router-dom";
import logo from "../../images/logo icon and text.svg";

const NavigationComponent: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      <nav className="nav-bar">
        <div className="logo-container">
          <img src={logo} alt="Logo" />
        </div>
        <div className="burger-menu">
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <div className="menu-links">
          <Link
            to="/"
            className={`menu-list-item ${
              location.pathname === "/" ? " active" : ""
            }`}
          >
            O NAS
          </Link>
          <Link
            to="/cennik"
            className={`menu-list-item ${
              location.pathname === "/cennik" ? " active" : ""
            }`}
          >
            CENNIK
          </Link>
          <Link
            to="/rezerwacja"
            className={`menu-list-item ${
              location.pathname === "/rezerwacja" ? " active" : ""
            }`}
          >
            REZERWACJA
          </Link>
          <Link
            to="/regulamin"
            className={`menu-list-item ${
              location.pathname === "/regulamin" ? " active" : ""
            }`}
          >
            WARUNKI WYNAJMU
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default NavigationComponent;
