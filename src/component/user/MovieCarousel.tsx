import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SliderArrow } from "./SliderArrow";

function MovieCarousel() {

  const settings: Settings = {
    dots: false,
    infinite: false,
    centerPadding: '10px',
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1, 
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ], 
    nextArrow: <SliderArrow direction="next"/>,
    prevArrow: <SliderArrow  direction="prev"/>

  };

  return (
    <div className="slider-container relative">
      <Slider {...settings}>
        <div className="p-2">
          <img
            className=" rounded-md object-scale-down"
            src="https://res.cloudinary.com/dqakjy0hk/image/upload/v1728090830/admin/gv7rjsfwylj4ohgfpmdd.jpg"
            alt="" />
        </div>
        <div className="p-2">
          <img
            className=" rounded-md object-scale-down"
            src="https://res.cloudinary.com/dqakjy0hk/image/upload/v1728044612/admin/vqjhoelxnjtlcfez02zz.jpg"
            alt="" />
        </div>
        <div className="p-2">
          <img
            className=" rounded-md object-scale-down"
            src="https://res.cloudinary.com/dqakjy0hk/image/upload/v1727571722/admin/ilzhfpgs3hyimlkgl9fj.jpg"
            alt="" />
        </div>
        <div className="p-2">
          <img
            className=" rounded-md object-scale-down"
            src="https://res.cloudinary.com/dqakjy0hk/image/upload/v1727572123/admin/ak5eudrk3350rhlwhp5b.jpg"
            alt="" />
        </div>  
        <div className="p-2">
          <img
            className=" rounded-md object-scale-down"
            src="https://res.cloudinary.com/dqakjy0hk/image/upload/v1727571722/admin/ilzhfpgs3hyimlkgl9fj.jpg"
            alt="" />
        </div>
        <div className="p-2">
          <img
            className=" rounded-md object-scale-down"
            src="https://res.cloudinary.com/dqakjy0hk/image/upload/v1727572123/admin/ak5eudrk3350rhlwhp5b.jpg"
            alt="" />
        </div>  
      </Slider>
    </div>
  )
}

export default MovieCarousel