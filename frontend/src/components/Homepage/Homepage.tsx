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
    // clear current user so we query for all the posts, not just a single user's posts
    dispatch(userSlice.actions.removeCurrentUser());
  }, [dispatch]);

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
          <img
            className="hero-img"
            src="https://local-wild-images.s3.us-east-1.amazonaws.com/bridge.png"
            alt=""
          />
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
