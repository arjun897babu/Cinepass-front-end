import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import { MovieType } from "../admin/MovieForm";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

type IData = {
  imageSrc: string,
  _id: string
}

interface ICarousel2Props {
  movieType: MovieType,
  data?: IData[]
}

function Carousel2({ movieType, data }: ICarousel2Props) {

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

export default Carousel2;
