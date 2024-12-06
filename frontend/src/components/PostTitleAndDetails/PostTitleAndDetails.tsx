import { useAppSelector } from "../../store";
import { Link } from "react-router-dom";
import "./PostTitleAndDetails.css";
import { formattedDate } from "../../utils/formatter";

const PostTitleAndDetails = () => {
  const currentPost = useAppSelector((state) => state.posts.currentPost);

  if (!currentPost) {
    return <></>;
  }

  return (
    <div className="title-and-details-container flex-col">
      <h1 className="post-title">{currentPost.title}</h1>
      <div className="post-details-container flex-col">
        <p className="post-credit-and-date flex-row">
          <span>Taken by </span>{" "}
          <Link
            className="link-to-photographer"
            to={`/users/${currentPost.photographerId}`}
          >
            {" "}
            {currentPost?.photographer?.username}
          </Link>{" "}
          {currentPost?.datePhotographed && (
            <span className="date-photographed">
              on {formattedDate(currentPost.datePhotographed)}
            </span>
          )}
        </p>
        {currentPost.fullDescription && (
          <p className="description">{currentPost.fullDescription}</p>
        )}
        {(currentPost.partOfDay || currentPost.locationString) && (
          <div className="post-location-and-part-of-day flex-row">
            {currentPost.partOfDay && (
              <p className="part-of-day">{currentPost.partOfDay}</p>
            )}
            {currentPost.locationString && <p>{currentPost.locationString}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostTitleAndDetails;
