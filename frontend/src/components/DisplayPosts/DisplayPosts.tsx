import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  postsSlice,
  getBatchOfPostsThunk,
} from "../../store/slices/postsSlice";
import { GetPostsOptions, Post } from "../../types";
import PostsCarousel from "../PostsCarousel";
import PostsList from "../PostsList";

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
  const [highestKey, setHighestKey] = useState(postsPerPageOrSlide);
  const [gettingMorePosts, setGettingMorePosts] = useState(false);

  // run this useEffect only once, when the component first mounts, to clean up any leftover state from whichever component used it last (Homepage or UserProfilePage)
  useEffect(() => {
    dispatch(postsSlice.actions.clearAllPosts());
    dispatch(postsSlice.actions.setTotalNumPosts(0));
    setGettingMorePosts(true);
  }, [dispatch]);

  // run this useEffect hook when component first mounts and then
  // anytime the slideOrPageNum changes, to reset the highest key to what we need for the new current slide or page
  useEffect(() => {
    const newHighestKey = slideOrPageNum * postsPerPageOrSlide;
    setHighestKey(newHighestKey);
  }, [slideOrPageNum, postsPerPageOrSlide, setHighestKey]);

  // run this useEffect when component first mounts and then again
  // anytime that we need to get another batch of paginated posts
  useEffect(() => {
    if (!gettingMorePosts) return;

    const getPostsOptions: GetPostsOptions = { slideOrPageNum: slideOrPageNum };
    // if we're using this inside a UserProfilePage component
    if (currentUser) {
      getPostsOptions.userId = currentUser.id;
    }

    dispatch(getBatchOfPostsThunk(getPostsOptions)); // will update postsSoFar, so that now the postsSoFar[highestKey] should be truthy and we can render the return component
  }, [currentUser, slideOrPageNum, gettingMorePosts, dispatch]);

  // console.log("total num posts: ", totalNumPosts);
  // console.log("get more posts: ", gettingMorePosts);
  // console.log("posts so far: ", postsSoFar);
  // console.log("highestKey: ", highestKey);
  // console.log("postsSoFar[highestKey]", postsSoFar[highestKey]);

  const needMorePosts = () => {
    const amountOfPostsSoFar = Object.keys(postsSoFar).length;
    return (
      amountOfPostsSoFar < slideOrPageNum * postsPerPageOrSlide &&
      totalNumPosts > amountOfPostsSoFar
    );
  };

  if (totalNumPosts === 0) {
    return <h1>No Posts To Display</h1>;
  }

  if (needMorePosts() && !gettingMorePosts) {
    setGettingMorePosts(true);
    return <></>; // loading bar?
  } else if (needMorePosts()) {
    return <></>;
  } else if (!needMorePosts() && gettingMorePosts) {
    setGettingMorePosts(false);
  }

  const postsToRender: Post[] = [];

  for (let i = postsPerPageOrSlide - 1; i >= 0; i--) {
    const nextPost = postsSoFar[highestKey - i];
    if (nextPost) {
      postsToRender.push(nextPost);
    }
  }

  if (listOrCarousel === "carousel") {
    return (
      <PostsCarousel
        postsToRender={postsToRender}
        totalNumPosts={totalNumPosts}
        postsPerSlide={postsPerPageOrSlide}
        slideNum={slideOrPageNum}
        setSlideNum={setSlideOrPageNum}
      />
    );
  }
  return (
    <PostsList
      postsToRender={postsToRender}
      totalNumPosts={totalNumPosts}
      postsPerPage={postsPerPageOrSlide}
      setPageNum={setSlideOrPageNum}
    />
  );
};

export default DisplayPosts;
