import { useRef } from "react";
import Introduction from "../Introduction";
import DisplayPosts from "../DisplayPosts";

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
      >
        <DisplayPosts listOrCarousel="carousel" postsPerPageOrSlide={3} />
      </div>
    </>
  );
};

export default Homepage;
