import { lazy } from "react"
import { MovieType } from "../../component/admin/MovieForm"
import Carousel2 from "../../component/user/CarouselSlider"
const MovieCarousel = lazy(() => import("../../component/user/MovieCarousel"))
const StreamHomePage = () => {
  return (
    <>
      <Carousel2
        movieType={MovieType.theater}
      />
      <div className="p-2">
        <div className="bg-base-100">
          <div className="p-2 space-y-5  ">
            <h1 className="capitalize font-bold text-2xl ml-2">new on stream</h1>
            <MovieCarousel />
          </div>
          <div className=" p-2 space-y-5  ">
            <h1 className="capitalize font-bold text-2xl ml-2">upcoming release</h1>
            <MovieCarousel />
          </div>
        </div>
      </div>
    </>
  )
}

export default StreamHomePage