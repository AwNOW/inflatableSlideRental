import "./assortmentComponent.css";
import NavigationComponent from "../NavigationComponent/NavigationComponent";
import ContactDetailsComponent from "../ContactDetailsComponent/ContactDetailsComponent";
import zamekA from "../../images/zamekA.png";
import zamekB from "../../images/zamekB.png";
import zamekC from "../../images/zamekA.png";
import { Link } from "react-router-dom";

const AssortmentComponent: React.FC = () => {
  const handleClick = () => {};

  return (
    <div>
      <nav>
        <NavigationComponent />
      </nav>
      <div className="asso-main-content">
        <h1 className="main-content-heading">Cennik</h1>
        <ul className="items-list">
          <li>
            <Link className="item-card" to="/rezerwacja">
              <img className="item-image" src={zamekA} alt="dmuchanec1" />
              <h2 className="item-card-heading">
                Nadmuchiwany zamek do skakania ze zjeżdżalnią.
              </h2>
              <div className="item-additional-info">
                <span>Wymiary:</span>
                <span>szerokość: 350 cm</span>
                <span>głębokość: 212 cm</span>
                <span>wysokość: 195 cm</span>
                <span>maksymalne obciążenie - 90 kg</span>
                <div>
                  <span>Cena:</span>{" "}
                  <span className="item-card-price">88 zł / doba</span>
                </div>
              </div>
              <div>
                <button className="button-primary yellow" type="submit">
                  REZERWUJ
                </button>
              </div>
            </Link>
          </li>
          <li>
            <Link className="item-card" to="/rezerwacja">
              <img className="item-image" src={zamekA} alt="dmuchanec1" />
              <h2 className="item-card-heading">
                Nadmuchiwany zamek do skakania ze zjeżdżalnią.
              </h2>
              <div className="item-additional-info">
                <span>Wymiary:</span>
                <span>szerokość: 350 cm</span>
                <span>głębokość: 212 cm</span>
                <span>wysokość: 195 cm</span>
                <span>maksymalne obciążenie - 90 kg</span>
                <div>
                  <span>Cena:</span>{" "}
                  <span className="item-card-price">88 zł / doba</span>
                </div>
              </div>
              <div>
                <button className="button-primary yellow" type="submit">
                  REZERWUJ
                </button>
              </div>
            </Link>
          </li>
          <li>
            <Link className="item-card" to="/rezerwacja">
              <img className="item-image" src={zamekB} alt="dmuchanec1" />
              <h2 className="item-card-heading">
                Nadmuchiwany zamek do skakania ze zjeżdżalnią.
              </h2>
              <div className="item-additional-info">
                <span>Wymiary:</span>
                <span>szerokość: 350 cm</span>
                <span>głębokość: 212 cm</span>
                <span>wysokość: 195 cm</span>
                <span>maksymalne obciążenie - 90 kg</span>
                <div>
                  <span>Cena:</span>{" "}
                  <span className="item-card-price">88 zł / doba</span>
                </div>
              </div>
              <div>
                <button className="button-primary yellow" type="submit">
                  REZERWUJ
                </button>
              </div>
            </Link>
          </li>
          <li>
            <Link className="item-card" to="/rezerwacja">
              <img className="item-image" src={zamekC} alt="dmuchanec1" />
              <h2 className="item-card-heading">
                Nadmuchiwany zamek do skakania ze zjeżdżalnią.
              </h2>
              <div className="item-additional-info">
                <span>Wymiary:</span>
                <span>szerokość: 350 cm</span>
                <span>głębokość: 212 cm</span>
                <span>wysokość: 195 cm</span>
                <span>maksymalne obciążenie - 90 kg</span>
                <div>
                  <span>Cena:</span>{" "}
                  <span className="item-card-price">88 zł / doba</span>
                </div>
              </div>
              <div>
                <button className="button-primary yellow" type="submit">
                  REZERWUJ
                </button>
              </div>
            </Link>
          </li>
        </ul>
      </div>
      <ContactDetailsComponent />
    </div>
  );
};

export default AssortmentComponent;
