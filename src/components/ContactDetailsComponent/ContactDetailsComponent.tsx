import React, { FC } from "react";
import NavigationComponent from "../NavigationComponent/NavigationComponent";
import BubblesComponent from "../BubblesComponent/BubblesComponent";
import GoogleMapReact, { Coords } from "google-map-react"; // Importing Coords type from google-map-react
import "./contactDetailsComponent.css";

const bubbleArr = [
  {
    top: "20px",
    left: "-90px",
    height: "400px",
    width: "400px",
    borderRadius: "400px",
  },
  {
    top: "280px",
    left: "-150px",
    height: "220px",
    width: "220px",
    borderRadius: "220px",
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
      <nav>
        <NavigationComponent />
      </nav>
      <div className="contact-main-content">
        <div className="main-content-text">
          <h1 className="main-content-heading">Kontakt</h1>
          <div className="text-adress">
            <span className="subheading">Hulańce dla Bajtli</span>
            <br />
            Ornontowice <br />
            Zwycięstwa 20A
            <br />
            Polska
          </div>
          <div className="contact-details">
            <span className="bold-contact-text">tel.:</span>
            <a className="contact-information-phone" href="tel:165162781">
              +48 165 162 781
            </a>
          </div>
          <div className="contact-details">
            <span className="bold-contact-text">e-mail:</span>
            <a className="contact-information-email" href="">
              example@example.com
            </a>
          </div>
          <div className="contact-details">
            <span className="bold-contact-text">Godziny otwarcia:</span>
            <span>pn - pt 15:00 - 19:00</span>
            <span>sb - nd 8:00 - 21:00</span>
          </div>
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
