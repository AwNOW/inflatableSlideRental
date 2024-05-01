import React, { FC } from "react";
import { Link } from "react-router-dom";
import GoogleMapReact from "google-map-react";
import { Coords } from "google-map-react"; // Importing Coords type from google-map-react
import { FaMapMarkerAlt } from "react-icons/fa"; // Assuming you're using Font Awesome for location icon
import "./contactDetailsComponent.css";

// MAPS

interface LocationPinProps {
  text: string;
}

const LocationPin: FC<LocationPinProps> = ({ text }) => (
  <div className="pin">
    <FaMapMarkerAlt className="pin-icon" />
    <p className="pin-text">{text}</p>
  </div>
);

const ContactDetailsComponent: FC = () => {
  const location: Coords = {
    lat: 37.42216,
    lng: -122.08427,
  };

  const address: string =
    "1600 Amphitheatre Parkway, Mountain View, California";

  return (
    <div className="contact-main-container">
      <div className="contact-details">
        <div className="map">
          <h2 className="main-column-heading">Jak Do Nas Dojechać</h2>
          <div className="google-map">
            <GoogleMapReact defaultCenter={location} defaultZoom={17}>
              <LocationPin text={address} />
            </GoogleMapReact>
          </div>
        </div>

        <div className="contact">
          <h1 className="main-column-heading">Kontakt</h1>
          <div className="contact-information">
            <div className="contact-details-item">
              <h2 className="bold-contact-text">Odwiedź nas</h2>
              <div>
                Ornontowice <br />
                Zwycięstwa 20A
                <br />
                Polska
              </div>
            </div>
            <div className="contact-details-item">
              <h2 className="bold-contact-text">Godziny otwarcia:</h2>
              <div>
                pn - pt 15:00 - 19:00 <br />
                sb - nd 8:00 - 21:00
              </div>
            </div>
            <div className="contact-details-item">
              <h2 className="bold-contact-text">Napisz do nas</h2>
              <a
                className="contact-details-link"
                href="mailto:hulance.dla.bajtli@onet.pl"
              >
                hulance.dla.bajtli@onet.pl
              </a>
            </div>
            <div className="contact-details-item">
              <h2 className="bold-contact-text">Zadzwoń</h2>
              <a className="contact-details-link" href="tel:165162781">
                +48 165 162 781
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        Copyright ©2024 Hulańce Dla Bajtli – Wynajem Zamków Dmuchanych
        Ornontowice - Wszystkie prawa zastrzeżone
      </div>
    </div>
  );
};

export default ContactDetailsComponent;
