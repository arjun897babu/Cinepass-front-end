import React, { lazy } from "react"
// import { Carousel } from "../../component/user/carousel"
const CarouselModule = lazy(() => import('./../../component/user/carousel'))
import { SearchWithFilters } from "../../component/user/footer/SearchWithFilters"
import MovieCard from "../../component/user/MovieCard"
import { AccordionAllOpen } from "../../component/user/Accordian"

const UserHome: React.FC = () => {
  return (
    <>

      <div className="p-2  bg-gray-200">
        <CarouselModule />
        <SearchWithFilters />
        <div className="mx-auto gap-1 flex p-2 bg-gray-200">
          {/* Accordion  */}
          <div className="hidden sm:block rounded-lg bg-white h-1/2 flex-shrink-0 w-full sm:w-1/4   p-2">
            <AccordionAllOpen />
          </div>
          {/* Movie cards  */}
          <div className="flex-grow grid grid-cols-2 rounded-lg p-1 bg-white mx-auto gap-x-5 gap-y-10 sm:grid-cols-2 sm:p-4 lg:grid-cols-3 lg:xxl:grid-cols-4 xl:gap-x-8">
            <MovieCard />
            <MovieCard />
            <MovieCard />
            <MovieCard />
          </div>
        </div>
      </div>


    </>
  )
}

export default UserHome
