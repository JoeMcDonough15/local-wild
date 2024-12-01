interface ImageAndCaptionProps {
  imageUrl: string;
  imageText: string;
  containerClasses?: string;
  imgClasses?: string;
  imageTextClasses?: string;
}

const PostImageAndCaption = ({
  imageUrl,
  imageText,
  containerClasses = "",
  imgClasses = "",
  imageTextClasses = "",
}: ImageAndCaptionProps) => {
  return (
    <div className={containerClasses}>
      <img className={imgClasses} src={imageUrl} alt={imageText} />
      <p className={imageTextClasses}>{imageText}</p>
    </div>
  );
};

export default PostImageAndCaption;
