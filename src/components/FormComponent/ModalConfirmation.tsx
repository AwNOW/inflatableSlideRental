import "./formComponent.css";
import {
  FaMailBulk,
  FaPhone,
  FaInstagram,
  FaFacebookSquare,
} from "react-icons/fa";

interface ModalConfirmationProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalConfirmation: React.FC<ModalConfirmationProps> = ({setShowModal}) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2 className="modal-heading">Dziękujemy za rezerwację!</h2>
        <div className="main-content-text">
          <p>
            Twoja rezerwacja została przyjęta. Dziękujemy za skorzystanie z
            naszych usług!
          </p>
          <div className="additional-info">
            <p>
              Jeśli masz jakiekolwiek pytania, skontaktuj się z nami - wyślij
              nam maila lub zadzwoń:
            </p>
            <ul className="icons-list">
              <li className="icon-email">
                <a href="mailto:hulancedlabajtli@gmail.com">
                  <FaMailBulk />
                </a>
              </li>
              <li className="icon-phone">
                <a href="tel:732495748">
                  <FaPhone />
                </a>
              </li>
            </ul>
            <p>
              Zapraszamy również do śledzenia nas na naszych profilach w mediach
              społecznościowych, aby być na bieżąco z nowościami i promocjami:
            </p>
            <ul className="icons-list">
              <li className="icon-inst">
                <a
                  href="https://www.instagram.com/hulance_dla_bajtli/?igsh=aWRkdWNjNXo0Nnk1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram />
                </a>
              </li>
              <li className="icon-fb">
                <a
                  href="https://www.facebook.com/profile.php?id=61558689674356"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookSquare />
                </a>
              </li>
            </ul>
          </div>
          <p>Udanej zabawy!</p>
        </div>

        <button className="close-modal" onClick={() => setShowModal(false)}>
          ZAMKNIJ
        </button>
      </div>
    </div>
  );
};

export default ModalConfirmation;
