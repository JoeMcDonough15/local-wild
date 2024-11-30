import { useAppSelector } from "../../store";
import { Link } from "react-router-dom";
const PostTitleAndDetails = () => {
  const currentPost = useAppSelector((state) => state.posts.currentPost);

  if (!currentPost) {
    return <></>;
  }

  return (
    <div className="post-title-and-details-container flex-col">
      <h1 className="post-title">{currentPost.title}</h1>
      <div className="post-details-container flex-col">
        <p className="post-credit-and-date">
          Taken by{" "}
          <Link to={`/users/${currentPost.photographerId}`}>
            {" "}
            {currentPost?.photographer?.username}
          </Link>{" "}
          {currentPost.datePhotographed && (
            <span> on {currentPost.datePhotographed.toString()}</span>
          )}
        </p>
        {currentPost.fullDescription && (
          <p className="description">{currentPost.fullDescription}</p>
        )}
        {currentPost.partOfDay && (
          <p className="post-location-and-part-of-day">
            {currentPost.partOfDay}
          </p>
        )}
      </div>
    </div>
  );
};

export default PostTitleAndDetails;
