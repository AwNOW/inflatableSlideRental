import "./assortmentComponent.css";
import NavigationComponent from "../NavigationComponent/NavigationComponent";
import ContactDetailsComponent from "../ContactDetailsComponent/ContactDetailsComponent";
import picAssoTypeA from "../../images/zamekA.png";
import picAssoTypeB from "../../images/zamekB.png";
import picAssoTypeC from "../../images/zamekC.png";
import picAssoTypeD from "../../images/zamekD.png";
import picAssoTypeE from "../../images/zamekE.png";
import picAssoTypeF from "../../images/zamekF.png";

import { Link } from "react-router-dom";
import { useEffect } from "react";

const AssortmentComponent: React.FC = () => {
  useEffect(() => {
    window.scrollTo({
      top: 0,
    })
  }, []);
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
              <div className="item-card-img-container">
                <img
                  className="item-image"
                  src={picAssoTypeF}
                  alt="dmuchanec1"
                />
              </div>
              <h2 className="item-card-heading">Zamek Bajtel</h2>
              <div className="item-additional-info">
                <span>Wymiary:</span>
                <span>szerokość: 3,00m</span>
                <span>głębokość: 2,80m</span>
                <span>wysokość: 2,10m</span>
                <span>
                  wymagana przestrzeń: 4x4m<sup>2</sup>
                </span>
                <span>waga użytkowania (max): 45kg</span>
                <span>obciążenie całkowite (max): 180kg</span>
                <div>
                  <span>Cena:</span>{" "}
                  <span className="item-card-price">150 zł / doba</span>
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
              <div className="item-card-img-container">
                <img
                  className="item-image"
                  src={picAssoTypeA}
                  alt="dmuchanec1"
                />
              </div>

              <h2 className="item-card-heading">Zamek La Palma</h2>
              <div className="item-additional-info">
                <span>Wymiary:</span>
                <span>szerokość: 4,68m</span>
                <span>głębokość: 4,06m</span>
                <span>wysokość: 2,40m</span>
                <span>
                  wymagana przestrzeń: 5x6m<sup>2</sup>
                </span>
                <span>waga użytkowania (max): 45kg</span>
                <span>obciążenie całkowite (max): 180kg</span>
                <div>
                  <span>Cena:</span>{" "}
                  <span className="item-card-price">200 zł / doba</span>
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
              <div className="item-card-img-container">
                <img
                  className="item-image"
                  src={picAssoTypeB}
                  alt="dmuchanec1"
                />
              </div>
              <h2 className="item-card-heading">Zamek Combo Slide</h2>
              <div className="item-additional-info">
                <span>Wymiary:</span>
                <span>szerokość: 2,15m</span>
                <span>głębokość: 6,00m</span>
                <span>wysokość: 2,85m</span>
                <span>
                  wymagana przestrzeń: 5x8m<sup>2</sup>
                </span>
                <span>waga użytkowania (max): 45kg</span>
                <span>obciążenie całkowite (max): 180kg</span>
                <div>
                  <span>Cena:</span>{" "}
                  <span className="item-card-price">250 zł / doba</span>
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
              <div className="item-card-img-container">
                <img
                  className="item-image"
                  src={picAssoTypeC}
                  alt="dmuchanec1"
                />
              </div>
              <h2 className="item-card-heading">Zamek Żyrafa</h2>
              <div className="item-additional-info">
                <span>Wymiary:</span>
                <span>szerokość: 3,40m</span>
                <span>głębokość: 3,50m</span>
                <span>wysokość: 2,45m</span>
                <span>
                  wymagana przestrzeń: 5x6m<sup>2</sup>
                </span>
                <span>waga użytkowania (max): 45kg</span>
                <span>obciążenie całkowite (max): 180kg</span>
                <div>
                  <span>Cena:</span>{" "}
                  <span className="item-card-price">250 zł / doba</span>
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
              <div className="item-card-img-container">
                <img
                  className="item-image"
                  src={picAssoTypeD}
                  alt="dmuchanec1"
                />
              </div>
              <h2 className="item-card-heading">Zamek Kangurek</h2>
              <div className="item-additional-info">
                <span>Wymiary:</span>
                <span>szerokość: 3,43m</span>
                <span>głębokość: 3,88m</span>
                <span>wysokość: 2,28m</span>
                <span>
                  wymagana przestrzeń: 5x5m<sup>2</sup>
                </span>
                <span>waga użytkowania (max): 45kg</span>
                <span>obciążenie całkowite (max): 180kg</span>
                <div>
                  <span>Cena:</span>{" "}
                  <span className="item-card-price">150 zł / doba</span>
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
              <div className="item-card-img-container">
                <img
                  className="item-image"
                  src={picAssoTypeE}
                  alt="dmuchanec1"
                />
              </div>
              <h2 className="item-card-heading">Zamek Słonik Maksa</h2>
              <div className="item-additional-info">
                <span>Wymiary:</span>
                <span>szerokość: 3,78m</span>
                <span>głębokość: 4,69m</span>
                <span>wysokość: 2,50m</span>
                <span>
                  wymagana przestrzeń: 5x6m<sup>2</sup>
                </span>
                <span>waga użytkowania (max): 45kg</span>
                <span>obciążenie całkowite (max): 180kg</span>
                <div>
                  <span>Cena:</span>{" "}
                  <span className="item-card-price">250 zł / doba</span>
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
        <p className="asso-lower-section-content-text">
          Podane ceny są cenami brutto!
        </p>
      </div>
      <ContactDetailsComponent />
    </div>
  );
};

export default AssortmentComponent;
