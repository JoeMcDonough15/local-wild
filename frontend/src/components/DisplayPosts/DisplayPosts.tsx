import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  postsSlice,
  getBatchOfPostsThunk,
} from "../../store/slices/postsSlice";
import { GetPostsOptions } from "../../types";
import PostsCarousel from "../PostsCarousel";
// import OpenModalButton from "../OpenModalButton/OpenModalButton";

interface DisplayPostsProps {
  postsPerPageOrSlide: number;
  listOrCarousel: string;
}

const DisplayPosts = ({
  postsPerPageOrSlide,
  listOrCarousel,
}: DisplayPostsProps) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const postsSoFar = useAppSelector((state) => state.posts.allPosts);
  const totalNumPosts = useAppSelector((state) => state.posts.totalNumPosts);
  const [slideOrPageNum, setSlideOrPageNum] = useState(1);
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
    const newHighestKey = slideOrPageNum * postsPerPageOrSlide;
    setHighestKey(newHighestKey);
  }, [slideOrPageNum, postsPerPageOrSlide, setHighestKey]);

  // run this useEffect when component first mounts and then again
  // anytime that we need to get another batch of paginated posts
  useEffect(() => {
    if (!needMorePosts) return;

    const getPostsOptions: GetPostsOptions = { slideOrPageNum: slideOrPageNum };
    // if we're using this inside a UserProfilePage component
    if (currentUser) {
      getPostsOptions.userId = currentUser.id;
    }

    dispatch(getBatchOfPostsThunk(getPostsOptions)); // will update postsSoFar, so that now the highestKey should be defined and we can render the carousel
  }, [
    currentUser,
    slideOrPageNum,
    needMorePosts,
    getBatchOfPostsThunk,
    dispatch,
  ]);

  if (!postsSoFar[highestKey]) {
    setNeedMorePosts(true);
    return <></>; // loading bar?
  } else {
    setNeedMorePosts(false);
  }

  const postsToRender = [];

  for (let i = postsPerPageOrSlide - 1; i >= 0; i--) {
    postsToRender.push(postsSoFar[highestKey - i]);
  }

  if (listOrCarousel === "carousel") {
    return (
      <PostsCarousel
        postsToRender={postsToRender}
        totalNumPosts={totalNumPosts}
        highestKey={highestKey}
        slideNum={slideOrPageNum}
        setSlideNum={setSlideOrPageNum}
      />
    );
  } else {
    return (
      // <PostsAsList posts={postsToRender} totalNumPosts={totalNumPosts} postsPerPage={postsPerSlideOrPage} pageNum={slideOrPageNum}, setPageNum={setSlideOrPageNum} />
      <section className="posts-list flex-col">
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
        <ul className="page-buttons flex-row"></ul>
      </section>
    );
  }
};

export default DisplayPosts;
