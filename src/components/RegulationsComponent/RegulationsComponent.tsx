import "./regulationsComponent.css";
import NavigationComponent from "../NavigationComponent/NavigationComponent";
import BubblesComponent from "../BubblesComponent/BubblesComponent";
import ContactDetailsComponent from "../ContactDetailsComponent/ContactDetailsComponent";

const bubbleArr = [
  {
    top: "-60px",
    left: "-180px",
    height: "120px",
    width: "120px",
    borderRadius: "120px",
  },
  {
    top: "-100px",
    left: "-110px",
    height: "150px",
    width: "150px",
    borderRadius: "150px",
  },
  {
    top: "-0px",
    left: "-150px",
    height: "80px",
    width: "80px",
    borderRadius: "80px",
  },
];

const RegulationsComponent: React.FC = () => {
  return (
    <div>
      <nav>
        <NavigationComponent />
      </nav>
      <h1 className="main-content-heading">Warunki Wynajmu</h1>
      <h2 className="content-title">Teren</h2>
      <ol className="main-content-list">
        <li>
          Podłoże powinno być trawiaste, umożliwiające zakotwiczenie urządzeń.
        </li>
        <li>
          Podłoże musi być oczyszczone z różnego rodzaju śmieci, gałęzi,
          kamieni, szkła i innych przedmiotów.
        </li>
        <li>
          Podłoże musi być równe, dmuchane atrakcje nie mogą być przechylone pod
          żadnym kątem.
        </li>
        <li>
          Teren musi być odpowiednio duży, aby zmieściły się na nim urządzenia.
        </li>
      </ol>

      <h2 className="content-title">Prąd</h2>
      <p>Urządzenia wymagają dostępu do gniazdka 230V w odległości…</p>

      <h2 className="content-title">Warunki Atmosferyczne</h2>
      <p>
        W przypadku złych warunków atmosferycznych, takich jak: opady deszczu,
        silne podmuchy wiatru, burza nie można korzystać z urządzeń.
      </p>

      <h2 className="content-title">Pozostałe</h2>
      <div className="regulations-lower-content">
        <ol className="main-content-list">
          <li>
            Darmowy dojazd do 15km, powyżej do każdego kolejnego 1km dopłata
            2zł.
          </li>
          <li>
            Urządzenia są wynajmowane na cały dzień, w godzinach od godz. 10:00
            do 19:00.
          </li>
          <li>
            Dostarczenie albo odbiór własny jest możliwy w dniu wynajmu od godz.
            7:00 do 10:00.
          </li>
          <li>Zwrot odbywa się od godz. 19:00 do 22:00.</li>
          <li>
            Godziny wynajmu można także dostosować do klienta indywidualnie.
          </li>
        </ol>
        <div className="regulation-bubbles-container">
          <BubblesComponent bubbles={bubbleArr} />
        </div>
      </div>
      <ContactDetailsComponent />
    </div>
  );
};

export default RegulationsComponent;
