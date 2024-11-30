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
        down
      </button>
      <div style={{ marginTop: "200vh" }} ref={beginHomepageContent}></div>
      <section className="homepage-content flex-col">
        <DisplayPosts listOrCarousel="carousel" postsPerPageOrSlide={3} />
        <OurMission />
      </section>
    </>
  );
};

export default Homepage;
