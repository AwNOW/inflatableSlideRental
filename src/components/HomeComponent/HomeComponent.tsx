import "./HomeComponent.css";
import "../../index.css";
import NavigationComponent from "../NavigationComponent/NavigationComponent";
import BubblesComponent from "../BubblesComponent/BubblesComponent";
import { Button } from "antd";
import type { SizeType } from "antd/es/config-provider/SizeContext";
import { useState } from "react";
import logo from "../../images/Zrzut ekranu 2024-04-14 220850.png";
import obrazek from "../../images/obrazek2 2.png";

let upperBubbleArr = [
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

function HomeComponent() {
  const [size, setSize] = useState<SizeType>("large");

  return (
    <div>
      <header>
        <nav>
          <img src={logo} alt="Logo" />
          <NavigationComponent />
        </nav>
      </header>
      <div className="upper-section">
        <div className="upper-section-content">
          <h1 className="mainHeading">Urządź Dzieciom Niezapomniany Dzień!</h1>
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
            size={size}
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
          <BubblesComponent bubbles={upperBubbleArr} />
        </div>
        <div className="lower-section-content">
          <h2 className="lower-section-heading">Jak Działamy</h2>
          <ol className="lower-section-content-list">
            <li>
              Wybierz dmuchańca, który Cię interesuje i zarezerwuj go. To
              proste! Możesz <a>zadzwonić</a> lub wypełnić
              <a>formularz online</a>.
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
          <p>Chcesz wiedzieć więcej?</p>

          <Button
            type="primary"
            shape="round"
            style={{
              color: "	rgb(0, 0, 0)",
              fontWeight: "500",
              backgroundColor: "#FFE54C",
            }}
            size={size}
            href="http://localhost:3000/regulamin"
          >
            SPRAWDŹ WARUNKI WYNAJMU
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomeComponent;
