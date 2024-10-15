import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import { IStreamingMovieData } from "../../interface/Interface";
import MovieInfoDisplay from "./MovieInfoDisplay";
import { MovieType } from "../admin/MovieForm";

const StreamCarousel: React.FC<{ movieDetails: IStreamingMovieData[] }> = ({ movieDetails }) => {
  const hasMultipleItems =movieDetails.length > 1;
  const settings: Settings = {
    pauseOnHover: false,
    dots: false,
    arrows:false,
    infinite: hasMultipleItems, 
    autoplay: hasMultipleItems,
    speed: 2000,  
  }
  return (
    <>
      <div className="slider-container  ">
        <Slider {...settings}
        >
          {
            movieDetails.map((movie) => (
              <MovieInfoDisplay
                key={movie.slug}
                movieType={MovieType.stream}
                movieDetails={movie as IStreamingMovieData}
              />
            ))
          }
        </Slider>
      </div>
    </>
  )
}


export default StreamCarousel