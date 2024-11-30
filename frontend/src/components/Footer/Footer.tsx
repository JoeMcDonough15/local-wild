import LinkTrio from "./LinkTrio";
import "./Footer.css";
import { ImInstagram, ImFacebook } from "react-icons/im";
import { FaXTwitter } from "react-icons/fa6";

const getYear = () => {
  const date = new Date();
  return date.getFullYear();
};

const Footer = () => {
  return (
    <footer className="footer flex-col">
      <div className="helpful-links flex-row">
        <LinkTrio
          linkNames={[
            "World Wildlife Fund",
            "The Nature Conservancy",
            "One Planet One Future",
          ]}
          linkDestinations={["", "", ""]}
          headerName="Conservation"
        />
        <LinkTrio
          linkNames={["Nikon", "Canon", "Panasonic"]}
          linkDestinations={["", "", ""]}
          headerName="Equipment"
        />
        <LinkTrio
          linkNames={["Back Country", "Moose Jaw", "Sierra"]}
          linkDestinations={["", "", ""]}
          headerName="Supplies"
        />
      </div>

      <div className="copyright-and-socials flex-row main-container">
        <p className="copyright">&copy;{` ${getYear()}`}</p>
        <div className="flex-row icon-row">
          <a>
            <ImInstagram />
          </a>
          <a>
            <ImFacebook />
          </a>
          <a>
            <FaXTwitter />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
