import { useRef, useEffect } from "react";
import Introduction from "../Introduction";
import DisplayPosts from "../DisplayPosts";
import { useAppDispatch } from "../../store";
import { userSlice } from "../../store/slices/userSlice";
import "./Homepage.css";
import OurMission from "../OurMission";

const Homepage = () => {
  const beginHomepageContent = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  const scrollContentIntoView = () => {
    beginHomepageContent?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    dispatch(userSlice.actions.removeCurrentUser());
  }, [dispatch]);

  return (
    <>
      <Introduction />
      <button
        type="button"
        className="scroll-button"
        onClick={scrollContentIntoView}
      >
        Enter
      </button>
      <div
        id="skip-intro"
        style={{ marginTop: "200vh" }}
        ref={beginHomepageContent}
      ></div>
      <section className="homepage-content flex-col">
        <div className="hero-img-container">
          <img className="hero-img" src="assets/images/bridge.png" alt="" />
        </div>
        <div className="title flex-col">
          <h2 className="title-font">Local Wild</h2>
          <p>Discover the beauty in your own back yard</p>
        </div>
        <DisplayPosts listOrCarousel="carousel" postsPerPageOrSlide={3} />
        <OurMission />
      </section>
    </>
  );
};

export default Homepage;
