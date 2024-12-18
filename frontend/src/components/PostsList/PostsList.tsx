import OpenModalButton from "../OpenModalButton/OpenModalButton";
import EditPostFormModal from "../EditPostFormModal";
import { useAppDispatch, useAppSelector } from "../../store";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import "./PostsList.css";
import { formattedDate } from "../../utils/formatter";
import { useEffect, useState } from "react";
import { GetPostsOptions, Post } from "../../types";
import { getAllPostsThunk } from "../../store/slices/postsSlice";
import { Link } from "react-router-dom";

const PostsList = () => {
  const allPosts = useAppSelector((state) => state.posts.allPosts);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const dispatch = useAppDispatch();
  const postsPerPage = 4;
  const [pageNum, setPageNum] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const numberOfPageChangeButtons = Math.ceil(allPosts.length / postsPerPage);
  const mapArray = [];
  for (let i = numberOfPageChangeButtons; i > 0; i--) {
    mapArray.push(null);
  }

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const getPostsOptions: GetPostsOptions = {};

    getPostsOptions.userId = currentUser.id;
    dispatch(getAllPostsThunk(getPostsOptions)).then(() => setLoaded(true));
  }, [dispatch, currentUser, setLoaded]);

  if (!currentUser) {
    return <></>;
  }

  if (!loaded) {
    return <h1 className="loading">Loading...</h1>;
  }

  // handle pagination inside the component
  const startingIndex = pageNum * postsPerPage - postsPerPage;
  const endingIndex = startingIndex + postsPerPage; // slice will go up to but not including endingIndex
  const postsToRender: Post[] = [...allPosts.slice(startingIndex, endingIndex)];

  if (postsToRender.length === 0) {
    return <h1 className="loading">No Posts To Display</h1>;
  }

  return (
    <section className="posts-list flex-col">
      {postsToRender.length === 0 && <h1>No posts yet</h1>}
      {postsToRender.map((eachPost) => {
        return (
          eachPost && (
            <div key={eachPost.id} className="post-row flex-row">
              <Link to={`/posts/${eachPost.id}`}>
                <img
                  className="post-thumbnail"
                  src={eachPost.imageUrl}
                  alt={eachPost.title}
                />{" "}
              </Link>

              <h3 className="post-name">{eachPost.title}</h3>
              <p className="post-upload-date">
                added {formattedDate(eachPost.createdAt)}
              </p>

              <div className="post-control-buttons flex-row">
                <OpenModalButton
                  classes="post-control-button"
                  buttonText="Edit"
                  modalComponent={<EditPostFormModal postId={eachPost.id} />}
                />
                <OpenModalButton
                  classes="post-control-button"
                  buttonText="Delete"
                  modalComponent={<ConfirmDeleteModal postId={eachPost.id} />}
                />
              </div>
            </div>
          )
        );
      })}
      {mapArray.length > 1 && (
        <ul className="page-buttons flex-row">
          {mapArray.map((_, index) => {
            return (
              <li className="page-change-button-container" key={index}>
                <button
                  className="page-change-button"
                  type="button"
                  onClick={(e) => {
                    setPageNum(Number(e.currentTarget.innerText));
                  }}
                >
                  {index + 1}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

export default PostsList;
