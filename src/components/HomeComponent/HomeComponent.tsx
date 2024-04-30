import "./homeComponent.css";
import NavigationComponent from "../NavigationComponent/NavigationComponent";
import BubblesComponent from "../BubblesComponent/BubblesComponent";
import ContactDetailsComponent from "../ContactDetailsComponent/ContactDetailsComponent";
import { Button } from "antd";
import obrazek from "../../images/obrazek.png";
import { Link } from "react-router-dom";

const upperBubbleArr = [
  {
    top: "-220px",
    left: "-400px",
    height: "350px",
    width: "350px",
    borderRadius: "350px",
  },
  {
    top: "-95px",
    left: "-300px",
    height: "350px",
    width: "350px",
    borderRadius: "350px",
  },
  {
    top: "20px",
    left: "-440px",
    height: "250px",
    width: "250px",
    borderRadius: "250px",
  },
  {
    top: "-250px",
    left: "-150px",
    height: "200px",
    width: "200px",
    borderRadius: "200px",
  },
];

const lowerBubbleArr = [
  {
    top: "-220px",
    left: "-400px",
    height: "350px",
    width: "350px",
    borderRadius: "350px",
  },
  {
    top: "-100px",
    left: "-330px",
    height: "350px",
    width: "350px",
    borderRadius: "350px",
  },
  {
    top: "-20px",
    left: "-480px",
    height: "250px",
    width: "250px",
    borderRadius: "250px",
  },
  {
    top: "-170px",
    left: "-150px",
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
      <div className="upper-section">
        <div className="upper-section-content">
          <h1 className="main-heading">Urządź Dzieciom Niezapomniany Dzień!</h1>
          <p className="upper-section-content-text">
            Planujesz urządzić niezapomniane urodziny swojemu dziecku? Może
            chcesz przygotować coś specjalnego na dzień dziecka? Wypożyczalnia
            naszych dmuchańców dla dzieci z pewnością sprawi, że każda impreza
            stanie się wyjątkowa.
            <br /> Gwarantujemy dobrą zabawę!
          </p>
          <Button
            type="primary"
            shape="round"
            style={{
              backgroundColor: "#28D2FF",
              color: "#000000",
              fontWeight: "500",
            }}
            size={"large"}
            href="http://localhost:3000/cennik"
          >
            SPRAWDŹ DMUCHAŃCE
          </Button>
        </div>
        <div className="img-container">
          <img src={obrazek} alt="dmuchanec1" />
          <BubblesComponent bubbles={upperBubbleArr} />
        </div>
      </div>
      <div className="lower-section">
        <div className="img-container">
          <img src={obrazek} alt="dmuchanec1" />
          <BubblesComponent bubbles={lowerBubbleArr} />
        </div>
        <div className="lower-section-content">
          <h2 className="main-content-heading">Jak Działamy</h2>
          <ol className="lower-section-content-list">
            <li>
              Wybierz dmuchańca, który Cię interesuje i zarezerwuj go. To
              proste! Możesz{" "}
              <a
                className="lower-section-link"
                href="tel:165162781"
              >
                zadzwonić
              </a>{" "}
              lub wypełnić{" "}
              <Link
                className="lower-section-link"
                to="/rezerwacja"
              >
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
              Po imprezie przyjedziemy ponownie w uzgodnionym terminie, złożymy
              dmuchańca i zabierzemy go z powrotem.
            </li>
          </ol>
          <div className="lower-section-content-contact">
            <p className="lower-section-content-subtext">
              Chcesz wiedzieć więcej?
            </p>

            <Button
              type="primary"
              shape="round"
              style={{
                color: "rgb(0, 0, 0)",
                fontWeight: "500",
                backgroundColor: "#FFE54C",
              }}
              size={"large"}
              href="http://localhost:3000/regulamin"
            >
              SPRAWDŹ WARUNKI WYNAJMU
            </Button>
          </div>
        </div>
      </div>
      <ContactDetailsComponent/>
    </div>
  );
};

export default HomeComponent;

//Playpen Sans
//Lato
