import { useRef, useEffect } from "react";
import Introduction from "../Introduction";
import DisplayPosts from "../DisplayPosts";
import { useAppDispatch } from "../../store";
import { userSlice } from "../../store/slices/userSlice";

const Homepage = () => {
  const homepageContent = useRef<HTMLDivElement | null>(null);
  const dispatch = useAppDispatch();

  const scrollContentIntoView = () => {
    homepageContent?.current?.scrollIntoView({ behavior: "smooth" });
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
