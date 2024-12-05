import { useRef, useEffect } from "react";
import Introduction from "../Introduction";
import { useAppDispatch, useAppSelector } from "../../store";
import { userSlice } from "../../store/slices/userSlice";
import "./Homepage.css";
import OurMission from "../OurMission";
import PostsCarousel from "../PostsCarousel";

const Homepage = () => {
  const beginHomepageContent = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.users.currentUser);

  const scrollContentIntoView = () => {
    beginHomepageContent?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    dispatch(userSlice.actions.removeCurrentUser());
  }, [dispatch]);

  // const location = navigator.geolocation.getCurrentPosition(() => {});
  // console.log("location: ", location);

  if (currentUser) {
    return <></>;
  }
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
      <section
        id="skip-intro"
        ref={beginHomepageContent}
        className="homepage-content flex-col"
      >
        <div className="hero-img-container">
          <img className="hero-img" src="assets/images/bridge.png" alt="" />
        </div>
        <div className="title flex-col">
          <h2 className="title-font">Local Wild</h2>
          <p>Discover the beauty in your own backyard...</p>
        </div>
        <PostsCarousel />
        <OurMission />
      </section>
    </>
  );
};

export default Homepage;
