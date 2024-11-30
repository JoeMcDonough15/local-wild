import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store";
import { useParams, useNavigate } from "react-router-dom";
import { getSinglePostThunk } from "../../store/slices/postsSlice";

const PostDetailsPage = () => {
  const sessionUser = useAppSelector((state) => state.session.sessionUser);
  const currentPost = useAppSelector((state) => state.posts.currentPost);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  // * in a useEffect:
  //    take the id from the params to then dispatch a thunk that will go get all the details for that post
  useEffect(() => {
    if (!sessionUser || !id) {
      return;
    }
    dispatch(getSinglePostThunk(Number(id)));
  }, [dispatch, id, sessionUser]);
  // if there is no sessionUser, redirect the user home and return <></>
  if (!sessionUser) {
    navigate("/");
    // maybe instead of automatically navigating back home, you display login/signup/go-back-home buttons
    // and a message that says they must be signed in to view a post's details
    return <></>;
  }

  // if there is no currentPost, return a message that says This Post Couldn't Be Found
  if (!currentPost) {
    return <h1>Post Couldn't Be Found</h1>;
  }

  // otherwise, return...
  return (
    <section className="post-details-page">
      <div className="post-details-first-row flex-row">
        {/* <PostImageWithCaption imageUrl={imageUrl} caption={caption} /> */}
        {/* <PostTitleAndDetails /> */}
      </div>
      <div className="post-details-second-row flex-row">
        {/* <CommentsSection /> */}
        {/* <PostLocationMap /> */}
      </div>
    </section>
  );
};

export default PostDetailsPage;
