import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../store";
import { useParams } from "react-router-dom";
import { getSinglePostThunk } from "../../store/slices/postsSlice";
import PostImageAndCaption from "../PostImageAndCaption";
import PostTitleAndDetails from "../PostTitleAndDetails";
import FullScreenImage from "../FullScreenImage";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import EditPostFormModal from "../EditPostFormModal";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import CommentsSection from "../CommentsSection/CommentsSection";
import "./PostDetailsPage.css";
import MapProvider from "../PostLocationMap/MapProvider";
import MustBeSignedIn from "../MustBeSignedIn/MustBeSignedIn";

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
    return <MustBeSignedIn />;
  }

  if (!currentPost) {
    return <h1 className="not-found">Post Couldn't Be Found</h1>;
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
        <section className="post-details-page flex-col below-header main-container">
          <div className="post-details-first-row flex-row">
            <div className="full-screen-button-and-image flex-col">
              {" "}
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
                postId={Number(id)}
                imageUrl={currentPost?.imageUrl}
                imageText={currentPost?.caption ? currentPost.caption : ""}
                containerClasses="post-details-page-image-and-caption-container flex-col"
                imgClasses="post-details-main-image"
              />{" "}
            </div>
            <div className="post-title-and-details-container flex-col">
              <PostTitleAndDetails />
            </div>
          </div>
          <div className="post-details-second-row flex-row">
            <CommentsSection />
            <MapProvider />
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
