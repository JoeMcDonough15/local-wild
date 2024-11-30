import { Post } from "../../types";
import "./PostsCarousel.css";

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
              <div key={index + 1} className="carousel-img-container">
                {" "}
                <img
                  className="carousel-img"
                  src={eachPost.imageUrl}
                  alt={eachPost.title}
                />
              </div>
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
