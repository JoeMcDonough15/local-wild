interface CarouselProps {
  postsToRender: any[];
  totalNumPosts: number;
  highestKey: number;
  slideNum: number;
  setSlideNum: (num: number) => void;
}

const PostsCarousel = ({
  postsToRender,
  totalNumPosts,
  highestKey,
  slideNum,
  setSlideNum,
}: CarouselProps) => {
  return (
    <section className="carousel flex-row">
      {slideNum > 1 && (
        <button
          onClick={() => {
            const newSlideNum = slideNum - 1;
            setSlideNum(newSlideNum);
          }}
          type="button"
          className="carousel-button button-back"
        >
          {" "}
          ⬅
        </button>
      )}
      <div className="gallery flex-row">
        {postsToRender.map((eachPost, index) => {
          return (
            eachPost && (
              <img
                key={index + 1}
                src={eachPost.imageUrl}
                alt={eachPost.title}
              />
            )
          );
        })}
      </div>
      {highestKey < totalNumPosts && (
        <button
          onClick={() => {
            const newSlideNum = slideNum + 1;
            setSlideNum(newSlideNum);
          }}
          type="button"
          className="carousel-button button-forward"
        >
          ➡️
        </button>
      )}
    </section>
  );
};

export default PostsCarousel;
