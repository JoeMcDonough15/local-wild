import { useNavigate } from "react-router-dom";
import "./PostImageAndCaption.css";

interface ImageAndCaptionProps {
  postId: number;
  imageUrl: string;
  imageText: string;
  containerClasses?: string;
  imgClasses?: string;
  imageTextClasses?: string;
}

const PostImageAndCaption = ({
  postId,
  imageUrl,
  imageText,
  containerClasses = "",
  imgClasses = "",
  imageTextClasses = "",
}: ImageAndCaptionProps) => {
  const navigate = useNavigate();
  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={() => {
        navigate(`/posts/${postId}`);
      }}
      className={containerClasses}
    >
      <div className="img-container">
        <img className={imgClasses} src={imageUrl} alt={imageText} />
      </div>
      <p className={imageTextClasses}>{imageText}</p>
    </div>
  );
};

export default PostImageAndCaption;
