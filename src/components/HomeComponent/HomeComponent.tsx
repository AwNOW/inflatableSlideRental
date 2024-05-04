import "./homeComponent.css";
import NavigationComponent from "../NavigationComponent/NavigationComponent";
import BubblesComponent from "../BubblesComponent/BubblesComponent";
import ContactDetailsComponent from "../ContactDetailsComponent/ContactDetailsComponent";
import obrazek from "../../images/obrazek.png";
import { Link } from "react-router-dom";

const upperBubbleArr = [
  {
    top: "-250px",
    left: "-400px",
    height: "350px",
    width: "350px",
    borderRadius: "350px",
  },
  {
    top: "-100px",
    left: "-300px",
    height: "350px",
    width: "350px",
    borderRadius: "350px",
  },
  {
    top: "35px",
    left: "-450px",
    height: "250px",
    width: "250px",
    borderRadius: "250px",
  },
  {
    top: "-280px",
    left: "-200px",
    height: "200px",
    width: "200px",
    borderRadius: "200px",
  },
];

const lowerBubbleArr = [
  {
    top: "-250px",
    left: "-410px",
    height: "350px",
    width: "350px",
    borderRadius: "350px",
  },
  {
    top: "-100px",
    left: "-340px",
    height: "350px",
    width: "350px",
    borderRadius: "350px",
  },
  {
    top: "60px",
    left: "-460px",
    height: "250px",
    width: "250px",
    borderRadius: "250px",
  },
  {
    top: "-280px",
    left: "-210px",
    height: "200px",
    width: "200px",
    borderRadius: "200px",
  },
];

const HomeComponent: React.FC = () => {
  return (
    <div>
      <nav>
        <NavigationComponent />
      </nav>
      <div className="component-container">
        <div className="homepage-upper-section">
          <div className="homepage-upper-section-content">
            <h1 className="homepage-main-heading">
              Urządź Dzieciom Niezapomniany Dzień!
            </h1>
            <p className="homepage-upper-section-content-text">
              Planujesz urządzić niezapomniane urodziny swojemu dziecku? Może
              chcesz przygotować coś specjalnego na dzień dziecka? Wypożyczalnia
              naszych dmuchańców dla dzieci z pewnością sprawi, że każda impreza
              stanie się wyjątkowa.
              <br /> Gwarantujemy dobrą zabawę!
            </p>
            <Link to="/cennik">
              <button className="button-primary">SPRAWDŹ DMUCHAŃCE</button>
            </Link>
          </div>
          <div className="homepage-img-container">
            <img src={obrazek} alt="dmuchanec1" />
            <BubblesComponent bubbles={upperBubbleArr} />
          </div>
        </div>
        <div className="container-img-asso">
          <img src={obrazek} alt="dmuchanec1" />
          <img src={obrazek} alt="dmuchanec1" />
        </div>
        <div className="homepage-lower-section">
          <div className="homepage-img-container">
            <img src={obrazek} alt="dmuchanec1" />
            <BubblesComponent bubbles={lowerBubbleArr} />
          </div>

          <div className="homepage-lower-section-content">
            <h2 className="homepage-main-content-heading">Jak Działamy</h2>
            <ol className="homepage-lower-section-content-list">
              <li>
                Wybierz dmuchańca, który Cię interesuje i zarezerwuj go. To
                proste! Możesz{" "}
                <a className="homepage-lower-section-link" href="tel:165162781">
                  zadzwonić
                </a>{" "}
                lub wypełnić{" "}
                <Link className="homepage-lower-section-link" to="/rezerwacja">
                  formularz online
                </Link>
                .
              </li>
              <li>
                Nasz zespół dostarczy wybrany sprzęt w ustalonym terminie i
                przygotuje go do użycia.
              </li>
              <li>
                Dmuchaniec gotowy do akcji! Teraz dzieci mogą bawić się do woli!
              </li>
              <li>
                Po imprezie przyjedziemy ponownie w uzgodnionym terminie,
                złożymy dmuchańca i zabierzemy go z powrotem.
              </li>
            </ol>
            <div className="homepage-lower-section-content-contact">
              <p className="homepage-lower-section-content-subtext">
                Chcesz wiedzieć więcej?
              </p>
              <Link to="/regulamin">
                <button className="button-primary yellow">
                  SPRAWDŹ WARUNKI WYNAJMU
                </button>
              </Link>
            </div>
          </div>
        </div>
        <ContactDetailsComponent />
      </div>
    </div>
  );
};

export default HomeComponent;

//Playpen Sans
//Lato
