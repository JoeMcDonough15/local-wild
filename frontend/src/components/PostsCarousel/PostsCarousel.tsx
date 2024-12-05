import { AiOutlineRight, AiOutlineLeft } from "react-icons/ai";
import { GetPostsOptions, Post } from "../../types";
import PostImageAndCaption from "../PostImageAndCaption";
import "./PostsCarousel.css";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { getAllPostsThunk } from "../../store/slices/postsSlice";

// have a viewing window of 3 indices for allPosts that determine which ones show up in view on the carousel
interface BrowserLocation {
  userLat: number;
  userLng: number;
}
interface CarouselProps {
  userLocation?: BrowserLocation;
}

const PostsCarousel = ({ userLocation }: CarouselProps) => {
  const dispatch = useAppDispatch();
  const postsToRender: Post[] = useAppSelector((state) => state.posts.allPosts);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const [slideNum, setSlideNum] = useState(1);
  const postsPerSlide = 3;

  useEffect(() => {
    const getPostsOptions: GetPostsOptions = {};
    if (userLocation) {
      getPostsOptions.userLat = userLocation.userLat;
      getPostsOptions.userLng = userLocation.userLng;
    }
    if (currentUser) {
      getPostsOptions.userId = currentUser.id;
    }

    dispatch(getAllPostsThunk(getPostsOptions));
  }, [dispatch, userLocation, currentUser]);

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
      {postsToRender.length > slideNum * postsPerSlide && (
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
