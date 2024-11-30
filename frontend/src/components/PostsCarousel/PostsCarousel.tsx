import { Post } from "../../types";

interface CarouselProps {
  postsToRender: Post[];
  totalNumPosts: number;
  slideNum: number;
  postsPerSlide: number;
  setSlideNum: (num: number) => void;
}

const PostsCarousel = ({
  postsToRender,
  totalNumPosts,
  slideNum,
  postsPerSlide,
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
      {totalNumPosts > slideNum * postsPerSlide && (
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
