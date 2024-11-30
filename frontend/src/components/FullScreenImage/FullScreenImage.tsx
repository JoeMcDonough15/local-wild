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
    <div onClick={() => setFullScreen(false)}>
      <img src={imageUrl} alt={imageAltText} />
    </div>
  );
};

export default FullScreenImage;
