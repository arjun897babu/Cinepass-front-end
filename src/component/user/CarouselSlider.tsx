import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
 import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { MovieType } from "../../interface/Interface";
 
type IData = {
  imageSrc: string,
  _id: string
}

interface ICarouselSliderProps {
  movieType: MovieType,
  data?: IData[]
}

function ICrouselSlider({ movieType, data }: ICarouselSliderProps) {

  const { movies } = useSelector((state: RootState) => state.user);

   if (!data && movieType === MovieType.theater && movies) {
    data = movies.map((movie) => ({
      _id: movie._id,
      imageSrc: movie.cover_photo
    })) as IData[];
  }

  const hasMultipleItems = data && data.length > 1;

   const settings: Settings = {
    className: 'center',
    centerMode: hasMultipleItems,   
    centerPadding: hasMultipleItems ? '10%' : '0%',   
    infinite: hasMultipleItems,   
    slidesToShow: 1,
    speed: 700,
    arrows: false,
    autoplay: hasMultipleItems,
    lazyLoad: 'ondemand',  
    pauseOnHover: false, 
  };

  return (
    <div className="">
      <Slider {...settings}>
        {data && data.length > 0 && (
          data.map((slider) => (
            <div className="p-2" key={slider._id}>
              <img
                className="w-full lg:h-[200px] object-scale-down lg:object-fill rounded-md"
                src={slider.imageSrc}
                alt="Movie Poster"
                loading="lazy" 
              />
            </div>
          ))
        )}
      </Slider>
    </div>
  );
}

export default ICrouselSlider;
