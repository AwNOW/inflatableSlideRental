import React, { FC } from "react";
import NavigationComponent from "../NavigationComponent/NavigationComponent";
import BubblesComponent from "../BubblesComponent/BubblesComponent";
import GoogleMapReact, { Coords } from "google-map-react"; // Importing Coords type from google-map-react
import "./contactDetailsComponent.css";

const bubbleArr = [
  {
    top: "-5px",
    left: "-150px",
    height: "400px",
    width: "400px",
    borderRadius: "400px",
  },
  {
    top: "210px",
    left: "-270px",
    height: "250px",
    width: "250px",
    borderRadius: "250px",
  },
];

//MAPS
interface AnyReactComponentProps {
  text: string;
  lat: number;
  lng: number;
}
const AnyReactComponent: FC<AnyReactComponentProps> = ({ text }) => (
  <div>{text}</div>
);
const defaultProps: { center: Coords; zoom: number } = {
  center: {
    lat: 10.99835602,
    lng: 77.01502627,
  },
  zoom: 11,
};

const ContactDetailsComponent: FC = () => {
  return (
    <div>
      <NavigationComponent />
      <div className="main-content">
        <div className="main-content-text">
          <h1 className="main-heading">Kontakt</h1>
          <p>
            <span className="subheading">Hulańce dla Bajtli</span>
            <br />
            Ornontowice <br />
            Zwycięstwa 20A
            <br />
            Polska
          </p>
          <p>
            tel.: <span>+48 165 162 781</span>
          </p>
          <p>
            e-mail: <span>example@example.com</span>
          </p>
          <p>
            Godziny otwarcia:
            <br />
            <span>pn - pt 15:00 - 19:00</span>
            <br />
            <span>sb - nd 8:00 - 21:00</span>
          </p>
        </div>

        <div className="bubble-container">
          <BubblesComponent bubbles={bubbleArr} />
        </div>
        <div style={{ height: "40vh", width: "50%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "" }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
          >
            <AnyReactComponent
              lat={59.955413}
              lng={30.337844}
              text="My Marker"
            />
          </GoogleMapReact>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsComponent;
