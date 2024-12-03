import { useAppSelector } from "../../store";
import { Link } from "react-router-dom";
import "./PostTitleAndDetails.css";

const PostTitleAndDetails = () => {
  const currentPost = useAppSelector((state) => state.posts.currentPost);

  if (!currentPost) {
    return <></>;
  }

  let formattedDate;

  if (currentPost.datePhotographed) {
    formattedDate = currentPost.datePhotographed.toString().split("T")[0];

    if (formattedDate) {
      formattedDate = new Date(formattedDate);
      formattedDate = formattedDate.toDateString();
    }
  }

  return (
    <div className="title-and-details-container flex-col">
      <h1 className="post-title">{currentPost.title}</h1>
      <div className="post-details-container flex-col">
        <p className="post-credit-and-date">
          Taken by{" "}
          <Link
            className="link-to-photographer"
            to={`/users/${currentPost.photographerId}`}
          >
            {" "}
            {currentPost?.photographer?.username}
          </Link>{" "}
          {formattedDate && <span> on {formattedDate}</span>}
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
