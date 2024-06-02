import React, { FC } from "react";
import "./contactDetails.css";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
} from "@vis.gl/react-google-maps";
import { FaInstagram, FaFacebookSquare } from "react-icons/fa"; // Assuming you're using Font Awesome for location icon


const location = {
  lat: 50.182427074933315,
  lng: 18.7635570829699,
};

const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string;

const ContactDetails: FC = () => {
  return (
    <div className="contact-main-container">
      <div className="contact-details">
        <div className="map">
          <h2 className="main-column-heading">Jak Do Nas Dojechać</h2>
          <div className="map-wrapper">
            <APIProvider apiKey={apiKey}>
              <Map
                mapId={"f7fb703ab67d9ce9"}
                defaultCenter={{
                  lat: 50.182427074933315,
                  lng: 18.7635570829699,
                }}
                defaultZoom={15}
                gestureHandling={"greedy"}
                disableDefaultUI={false}
              >
                <AdvancedMarker position={location}>
                  <Pin scale={1.1}></Pin>
                </AdvancedMarker>
              </Map>
            </APIProvider>
          </div>
        </div>
        <div className="contact">
          <h2 className="main-column-heading">Kontakt</h2>
          <div className="contact-information">
            <div className="contact-details-item">
              <h2 className="bold-contact-text">Adres</h2>
              <div>
                ul. Zwycięstwa 20A <br />
                43-178 Ornontowice <br />
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
                href="mailto:hulancedlabajtli@gmail.com"
              >
                hulancedlabajtli@gmail.com
              </a>
            </div>
            <div className="contact-details-item">
              <h2 className="bold-contact-text">Zadzwoń</h2>
              <a className="contact-details-link" href="tel:732495748">
                +48 732 495 748
              </a>
            </div>
          </div>
          <div className="contact-details-social-icons">
            <h2 className="bold-contact-text">Znajdź nas również</h2>
            <a
              className="social-icon-inst"
              href="https://www.instagram.com/hulance_dla_bajtli/?igsh=aWRkdWNjNXo0Nnk1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>
            <a
              className="social-icon-fb"
              href="https://www.facebook.com/profile.php?id=61558689674356"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookSquare />
            </a>
          </div>
        </div>
      </div>
      <div className="footer">
        Copyright ©2024 Hulańce dla Bajtli – Wynajem Zamków Dmuchanych
        Ornontowice - Wszystkie prawa zastrzeżone
      </div>
    </div>
  );
};

export default ContactDetails;
