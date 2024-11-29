import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  postsSlice,
  getBatchOfPostsThunk,
} from "../../store/slices/postsSlice";
import { GetPostsOptions } from "../../types";
import OpenModalButton from "../OpenModalButton/OpenModalButton";

interface DisplayPostsProps {
  numPostsPerSlideOrPage?: number;
  listOrCarousel: string;
}

const DisplayPosts = ({
  numPostsPerSlideOrPage,
  listOrCarousel,
}: DisplayPostsProps) => {
  const POSTS_PER_SLIDE = numPostsPerSlideOrPage || 3;
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const postsSoFar = useAppSelector((state) => state.posts.allPosts);
  const totalNumPosts = useAppSelector((state) => state.posts.totalNumPosts);
  const [slideNum, setSlideNum] = useState(1);
  const [highestKey, setHighestKey] = useState(3);
  const [needMorePosts, setNeedMorePosts] = useState(false);

  // run this useEffect only once, when the component first mounts, to clean up any leftover state from whichever component used it last (Homepage or UserProfilePage)
  useEffect(() => {
    dispatch(postsSlice.actions.clearAllPosts());
    dispatch(postsSlice.actions.setTotalNumPosts(0));
  }, [dispatch]);

  // run this useEffect hook when component first mounts and then
  // anytime the slideNum changes, to reset the highest key to what we need for the current slide
  useEffect(() => {
    const newHighestKey = slideNum * POSTS_PER_SLIDE;
    setHighestKey(newHighestKey);
  }, [slideNum, POSTS_PER_SLIDE, setHighestKey]);

  // run this useEffect when component first mounts and then again
  // anytime that we need to get another batch of paginated posts
  useEffect(() => {
    if (!needMorePosts) return;

    const getPostsOptions: GetPostsOptions = { slideOrPageNum: slideNum };
    // if we're using this inside a UserProfilePage component
    if (currentUser) {
      getPostsOptions.userId = currentUser.id;
    }

    dispatch(getBatchOfPostsThunk(getPostsOptions)); // will update postsSoFar, so that now the highestKey should be defined and we can render the carousel
  }, [currentUser, slideNum, needMorePosts, getBatchOfPostsThunk, dispatch]);

  if (!postsSoFar[highestKey]) {
    setNeedMorePosts(true);
    return <></>; // loading bar?
  } else {
    setNeedMorePosts(false);
  }

  const postsToRender = [
    postsSoFar[highestKey - 2],
    postsSoFar[highestKey - 1],
    postsSoFar[highestKey],
  ];

  if (listOrCarousel === "carousel") {
    return (
      // <PostsAsCarousel />
      <section className="carousel flex-row">
        {slideNum > 1 && (
          <button
            onClick={() => {
              setSlideNum(() => slideNum - 1);
            }}
            type="button"
            className="carousel-button button-back"
          >
            {" "}
            ⬅
          </button>
        )}
        <div className="gallery flex-row">
          {postsToRender.map((eachPost, index) => {
            return (
              eachPost && (
                <img
                  key={index + 1}
                  src={eachPost.imageUrl}
                  alt={eachPost.title}
                />
              )
            );
          })}
        </div>
        {highestKey < totalNumPosts && (
          <button
            onClick={() => {
              setSlideNum(() => slideNum + 1);
            }}
            type="button"
            className="carousel-button button-forward"
          >
            ➡️
          </button>
        )}
      </section>
    );
  } else {
    return (
      // <PostsAsList />
      <section className="posts-list">
        {postsToRender.map((eachPost, index) => {
          return (
            eachPost && (
              <div key={index + 1} className="post-row flex-row">
                <img
                  className="post-thumbnail"
                  src={eachPost.imageUrl}
                  alt={eachPost.title}
                />
                <h3>{eachPost.title}</h3>
                {eachPost.datePhotographed && (
                  <p>{eachPost.datePhotographed.toString()}</p>
                )}
                {/* <div className="post-control-buttons">
                  <OpenModalButton
                    buttonText="Edit"
                    modalComponent={<EditPostModal />}
                  />
                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={<DeleteConfirmationModal />}
                  />
                </div> */}
              </div>
            )
          );
        })}
      </section>
    );
  }
};

export default DisplayPosts;
