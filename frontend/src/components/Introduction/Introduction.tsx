import "./Introduction.css";
import { useState, useEffect } from "react";

const introImageLandscape = "coopershawklandscape.jpg";
const introImagePortrait = "coopershawkportrait.jpg";

const Introduction = () => {
  const [introImage, setIntroImage] = useState<string>(introImageLandscape);

  useEffect(() => {
    const determineImage = () => {
      if (window.innerWidth < 500) {
        setIntroImage(introImagePortrait);
      } else {
        setIntroImage(introImageLandscape);
      }
    };

    determineImage();

    window.addEventListener("resize", determineImage);

    return () => window.removeEventListener("resize", determineImage);
  }, [setIntroImage]);

  return (
    <>
      <div className="introduction-image-container">
        <img
          src={`/assets/images/${introImage}`}
          alt="coopers hawk crying out"
          className="introduction-image"
        />{" "}
      </div>
    </>
  );
};

export default Introduction;
