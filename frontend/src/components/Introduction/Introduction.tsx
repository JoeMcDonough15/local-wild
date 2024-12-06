import "./Introduction.css";
import { useState, useEffect } from "react";

const introImageLandscape =
  "https://local-wild-images.s3.us-east-1.amazonaws.com/coopershawkcry.jpg";
const introImagePortrait =
  "https://local-wild-images.s3.us-east-1.amazonaws.com/coopershawkportrait.jpg";

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
          src={introImage}
          alt="cooper's hawk crying out"
          className="introduction-image"
        />{" "}
      </div>
    </>
  );
};

export default Introduction;
