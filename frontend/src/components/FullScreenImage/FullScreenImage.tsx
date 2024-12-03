import "./FullScreenImage.css";

interface FullScreenImageProps {
  imageUrl: string;
  imageAltText: string;
  setFullScreen: (arg: boolean) => void;
}

const FullScreenImage = ({
  imageUrl,
  imageAltText,
  setFullScreen,
}: FullScreenImageProps) => {
  return (
    <div
      className="full-screen-img-container"
      onClick={() => setFullScreen(false)}
    >
      <img className="full-screen-img" src={imageUrl} alt={imageAltText} />
    </div>
  );
};

export default FullScreenImage;
