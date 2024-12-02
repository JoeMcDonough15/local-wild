import OpenModalButton from "../OpenModalButton/OpenModalButton";
import EditPostFormModal from "../EditPostFormModal";
import { Post } from "../../types";
import ConfirmDeleteModal from "../ConfirmDeleteModal";

interface PostsListProps {
  postsToRender: Post[];
  totalNumPosts: number;
  postsPerPage: number;
  setPageNum: (num: number) => void;
}

const PostsList = ({
  postsToRender,
  totalNumPosts,
  postsPerPage,
  setPageNum,
}: PostsListProps) => {
  const numberOfPageChangeButtons = Math.ceil(totalNumPosts / postsPerPage);
  const mapArray = [];
  for (let i = numberOfPageChangeButtons; i > 0; i--) {
    mapArray.push(null);
  }

  return (
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
              <div className="post-control-buttons">
                <OpenModalButton
                  buttonText="Edit"
                  modalComponent={
                    <EditPostFormModal
                      postId={eachPost.id}
                      keyForStore={index + 1}
                    />
                  }
                />
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={
                    <ConfirmDeleteModal
                      postId={eachPost.id}
                      keyForStore={index + 1}
                    />
                  }
                />
              </div>
            </div>
          )
        );
      })}
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
    </section>
  );
};

export default PostsList;
