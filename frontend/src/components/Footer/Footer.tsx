import LinkTrio from "./LinkTrio";

const getYear = () => {
  const date = new Date();
  return date.getFullYear();
};

const Footer = () => {
  return (
    <section className="footer flex-col">
      <div className="helpful-links flex-row">
        <LinkTrio
          linkNames={[
            "World Wildlife Fund",
            "The Nature Conservancy",
            "One Planet One Future",
          ]}
          linkDestinations={["", "", ""]}
          headerName="Conservation"
          flexDirection="col"
        />
        <LinkTrio
          linkNames={["Nikon", "Canon", "Panasonic"]}
          linkDestinations={["", "", ""]}
          headerName="Equipment"
          flexDirection="col"
        />
        <LinkTrio
          linkNames={["Back Country", "Moose Jaw", "Sierra"]}
          linkDestinations={["", "", ""]}
          headerName="Supplies"
          flexDirection="col"
        />
      </div>

      <div className="copyright-and-socials flex-row">
        <p className="copyright">&copy;{` ${getYear()}`}</p>
        <LinkTrio
          linkNames={["X", "Instagram", "Facebook"]}
          linkDestinations={["", "", ""]}
          flexDirection="row"
        />
      </div>
    </section>
  );
};

export default Footer;
