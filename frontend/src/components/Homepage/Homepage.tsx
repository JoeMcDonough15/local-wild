import Introduction from "../Introduction";
import { useRef } from "react";

const Homepage = () => {
  const homepageContent = useRef<HTMLDivElement | null>(null);

  const scrollContentIntoView = () => {
    homepageContent?.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Introduction />
      <button
        type="button"
        className="scroll-button"
        onClick={scrollContentIntoView}
      >
        down
      </button>
      <div
        style={{ marginTop: "200vh" }}
        ref={homepageContent}
        id="homepage-content"
      ></div>
    </>
  );
};

export default Homepage;
