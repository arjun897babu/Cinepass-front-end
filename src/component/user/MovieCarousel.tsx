import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SliderArrow } from "./SliderArrow";
import { IStreamingMovieData } from "../../interface/Interface";
import { Link } from "react-router-dom";

function MovieCarousel({ movieDetails }: { movieDetails: IStreamingMovieData[] }) {
  const slidesToShow = Math.min(movieDetails.length, 4)
  const settings: Settings = {
    pauseOnHover: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(movieDetails.length, 4),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: Math.min(movieDetails.length, 3),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: Math.min(movieDetails.length, 2),
          slidesToScroll: 1
        }
      }
    ],
    nextArrow: movieDetails.length > slidesToShow ? <SliderArrow direction="next" /> : undefined,
    prevArrow: movieDetails.length > slidesToShow ? <SliderArrow direction="prev" /> : undefined

  };

  return (
    <div className="slider-container relative">
      <Slider {...settings}>
        {
          movieDetails.map((movie) => (<Link key={movie.slug} to={`/movie/${movie.slug}`}><div className="p-2">
          <img
            className=" rounded-md object-scale-down"
            src={movie.movie_poster}
            alt={movie.movie_name} />
        </div> </Link>))
        }
    </Slider>
    </div >
  )
}

export default MovieCarousel