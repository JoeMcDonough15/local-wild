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
    <>
      <div className="helpful-links flex-row">
        <LinkTrio
          linkNames={[
            "World Wildlife Fund",
            "The Nature Conservancy",
            "One Planet One Future",
          ]}
          linkDestinations={[
            "https://protect.worldwildlife.org/page/53256/donate/1?en_og_source=SearchAd_Donation&ea.tracking.id=PaidAd_Google_Membership&supporter.appealCode=AWE2010OQ18507A04091RX&utm_source=googlepaid&utm_medium=cpc&utm_campaign=brand&gad_source=1&gclid=EAIaIQobChMIw8Kd196TigMV4Ub_AR3DnBSnEAAYASAAEgIoDvD_BwE",
            "https://preserve.nature.org/page/158465/donate/1?en_txn1=p_g.dfa.fd.gtues24.mb.dtd.br.X&supporter.appealCode=AHOMQ241101W1SXX01&en_txn8=NewSch.ADPCGO2411PDMZNZZD01Z01-BZUZZ-DGAQ&gclsrc=aw.ds&gad_source=1&gclid=EAIaIQobChMIwMCKj9-TigMVT1dHAR0isBMeEAAYASAAEgK6GPD_BwE",
            "https://oneplanetonefuture.org/education?gad_source=1&gclid=EAIaIQobChMIm6KDmN-TigMVsFtHAR0VAzw_EAAYAiAAEgLt7vD_BwE",
          ]}
          headerName="Conservation"
        />
        <LinkTrio
          linkNames={["Nikon", "Canon", "Panasonic"]}
          linkDestinations={[
            "https://www.nikonusa.com/?utm_source=google&utm_medium=cpc&utm_campaign=brand_exact&gad_source=1&gclid=EAIaIQobChMIroHtnt-TigMVkTIIBR084yA3EAAYASAAEgIQzvD_BwE",
            "https://www.usa.canon.com/?gad_source=1&gclid=EAIaIQobChMI1dXjpd-TigMVczMIBR0sIgYlEAAYASAAEgLYNvD_BwE&gclsrc=aw.ds",
            "https://shop.panasonic.com/?srsltid=AfmBOoohAghce5DUt19mISK2X0YaPOjT400-Tj64YRav425uUjxpZ10p",
          ]}
          headerName="Equipment"
        />
        <LinkTrio
          linkNames={["Back Country", "Public Lands", "Sierra"]}
          linkDestinations={[
            "https://www.backcountry.com/?utm_source=google&utm_medium=cpcb&utm_campaign=857545824__p:G%7Cs:BC%7Cct:BPS%7Cct2:xx%7Cg:xx%7Cc1:Brand%7Cc2:xx%7Cb:Backcountry%7Cmt:Exact&utm_content=46278568547&utm_id=go_cmp-857545824_adg-46278568547_ad-673338934294_kwd-50734273_dev-c_ext-_prd-_mca-_sig-EAIaIQobChMI0_zRz9-TigMVj1xHAR3mXyJXEAAYASAAEgKsvfD_BwE&gad_source=1&gclid=EAIaIQobChMI0_zRz9-TigMVj1xHAR3mXyJXEAAYASAAEgKsvfD_BwE&gclsrc=aw.ds",
            "https://www.publiclands.com/?camp=SEM:PBL_43700066411407145_brand_kwd-39376712&gad_source=1&gclid=EAIaIQobChMI5Yfo5d-TigMV819HAR1QhRDyEAAYASAAEgIltPD_BwE&gclsrc=aw.ds",
            "https://www.sierra.com/",
          ]}
          headerName="Supplies"
        />
      </div>

      <div className="copyright-and-socials flex-row main-container">
        <p className="copyright">&copy;{` ${getYear()}`}</p>
        <div className="flex-row icon-row">
          <a target="_blank" href="www.instagram.com">
            <ImInstagram />
          </a>
          <a target="_blank">
            <ImFacebook href="www.facebook.com" />
          </a>
          <a target="_blank" href="www.x.com">
            <FaXTwitter />
          </a>
        </div>
      </div>
    </>
  );
};

export default Footer;
