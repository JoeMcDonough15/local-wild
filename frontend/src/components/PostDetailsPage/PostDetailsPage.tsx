import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store";
import { useParams, Link } from "react-router-dom";
import { getSinglePostThunk } from "../../store/slices/postsSlice";
import PostImageAndCaption from "../PostImageAndCaption";
import PostTitleAndDetails from "../PostTitleAndDetails";
import FullScreenImage from "../FullScreenImage";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import EditPostFormModal from "../EditPostFormModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import CommentsSection from "../CommentsSection/CommentsSection";

const PostDetailsPage = () => {
  const sessionUser = useAppSelector((state) => state.session.sessionUser);
  const currentPost = useAppSelector((state) => state.posts.currentPost);
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [userOwnsPost, setUserOwnsPost] = useState(false);
  const [imageFullScreen, setImageFullScreen] = useState(false);

  useEffect(() => {
    if (!sessionUser || !id) {
      return;
    }
    dispatch(getSinglePostThunk(Number(id)));
  }, [sessionUser, id, dispatch]);

  if (!sessionUser) {
    return (
      <>
        <h3>Please log in or make an account to view a post up close!</h3>
        <>
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
          <OpenModalButton
            buttonText="Login"
            modalComponent={<LoginFormModal />}
          />
        </>
        <Link to="/home#skip-intro">Go Back Home</Link>
      </>
    );
  }

  if (!currentPost) {
    return <h1>Post Couldn't Be Found</h1>;
  }

  if (!userOwnsPost && sessionUser.id === currentPost.photographerId) {
    setUserOwnsPost(true);
  }

  return (
    <>
      {imageFullScreen ? (
        <FullScreenImage
          setFullScreen={setImageFullScreen}
          imageUrl={currentPost.imageUrl}
          imageAltText={currentPost.title}
        />
      ) : (
        <section className="post-details-page">
          <div className="post-details-first-row flex-row">
            <button
              onClick={() => {
                setImageFullScreen(true);
              }}
              className="full-screen-button"
              type="button"
            >
              View Full Screen
            </button>

            <PostImageAndCaption
              imageUrl={currentPost?.imageUrl}
              imageText={currentPost?.caption ? currentPost.caption : ""}
              // plus classes for the container, image, and caption styles
            />
            <PostTitleAndDetails />
          </div>
          <div className="post-details-second-row flex-row">
            <CommentsSection />
            {/* <PostLocationMap /> */}
          </div>
          {userOwnsPost && (
            <div className="post-control-buttons flex-row">
              <OpenModalButton
                buttonText="Edit"
                modalComponent={<EditPostFormModal postId={currentPost.id} />}
              />
              <OpenModalButton
                buttonText="Delete"
                modalComponent={<ConfirmDeleteModal postId={currentPost.id} />}
              />
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default PostDetailsPage;
