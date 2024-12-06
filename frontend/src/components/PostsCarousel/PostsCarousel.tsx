import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { GetPostsOptions, Post } from "../../types";
import PostImageAndCaption from "../PostImageAndCaption";
import "./PostsCarousel.css";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { getAllPostsThunk } from "../../store/slices/postsSlice";

const PostsCarousel = () => {
  const dispatch = useAppDispatch();
  const allPosts: Post[] = useAppSelector((state) => state.posts.allPosts);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const [slideNum, setSlideNum] = useState(1);
  const postsPerSlide = 3;

  useEffect(() => {
    const getPostsOptions: GetPostsOptions = {};

    if (currentUser) {
      getPostsOptions.userId = currentUser.id;
    }
    // get device's location if allowed by user
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        getPostsOptions.userLat = position.coords.latitude;
        getPostsOptions.userLng = position.coords.longitude;
        dispatch(getAllPostsThunk(getPostsOptions));
      }
    );
  }, [dispatch, currentUser]);

  // handle which posts are viewed on each slide
  const startingIndex = slideNum * postsPerSlide - postsPerSlide;
  const endingIndex = startingIndex + postsPerSlide; // slice will go up to but not including endingIndex
  const postsToRender: Post[] = [...allPosts.slice(startingIndex, endingIndex)];

  if (postsToRender.length === 0) {
    return <h1>Loading...</h1>;
  }

  return (
    <section className="carousel flex-row">
      {slideNum > 1 && (
        <button
          onClick={() => {
            const newSlideNum = slideNum - 1;
            setSlideNum(newSlideNum);
          }}
          type="button"
          className="carousel-button button-back"
        >
          <AiOutlineLeft />{" "}
        </button>
      )}
      <div className="gallery flex-row">
        {postsToRender.map((eachPost) => {
          return (
            eachPost && (
              <PostImageAndCaption
                key={eachPost.id}
                postId={eachPost.id}
                imageUrl={eachPost.imageUrl}
                imageText={eachPost.title}
                containerClasses="carousel-tile-container flex-col"
                imgClasses="carousel-img"
              />
            )
          );
        })}
      </div>
      {allPosts.length > slideNum * postsPerSlide && (
        <button
          onClick={() => {
            const newSlideNum = slideNum + 1;
            setSlideNum(newSlideNum);
          }}
          type="button"
          className="carousel-button button-forward"
        >
          <AiOutlineRight />
        </button>
      )}
    </section>
  );
};

export default PostsCarousel;
