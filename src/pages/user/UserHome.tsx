import React, { lazy,  useState } from "react"

const CarouselModule = lazy(() => import('./../../component/user/carousel'))
import { SearchWithFilters } from "../../component/user/footer/SearchWithFilters"
import MovieCard from "../../component/user/MovieCard"
import Accordion from "../../component/user/Accordion"
import { Link, } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"

import EmptyData from "../../component/EmptyData"
import LocationModal from "./LocationModal"
import { getIST } from "../../utils/format"
import { MovieFilter } from "../../interface/Interface"
import { isFilterEmpty } from "../../utils/validator"


const UserHome: React.FC = () => {
  const [filterItem, setFilterItem] = useState<Partial<MovieFilter> | null>(null)

  const setFilter = (filterItem: Partial<MovieFilter> | null) => {
    setFilterItem(filterItem)
  }

  const { movies = [] } = useSelector((state: RootState) => state.user)

  if (!movies && isFilterEmpty(filterItem)) {
    return (

      <div className="flex justify-center items-centre">
        <LocationModal />
        <EmptyData />
      </div>
    )
  };

  return (

    <>
      {movies && <div className="p-2   bg-gray-200">
        <CarouselModule moviePoster={movies.map((singleMovie) => singleMovie.cover_photo)} />
        <SearchWithFilters
          setFilter={setFilter}
        />
        <div className="mx-auto gap-1 flex p-2 bg-gray-200">
          {/* Accordion  */}
          <div className="hidden mt-4 sm:block rounded-lg bg-white h-1/2 flex-shrink-0 w-full sm:w-1/4   p-2">
            <Accordion
              setFilter={setFilter}
            />
          </div>
          {/* Movie cards  */}
          <div className=" grid grid-cols-2 rounded-lg p-1 items-center justify-center mx-auto gap-x-4 gap-y-4 sm:grid-cols-2 sm:p-4 lg:grid-cols-3 lg:xxl:grid-cols-4 xl:gap-x-4">
            {
              movies.length > 0 &&
              (movies.map((movie) => {
                const releaseDate = new Date(movie.release_date);
                const currentDate = new Date();
                const bookingDate = getIST(currentDate <= releaseDate ? releaseDate.toString() : currentDate.toString());
                return <Link key={movie._id} to={`/movie/${movie.slug}?bookingDate=${bookingDate}`}> <MovieCard movie={movie} />  </Link>
              }))
            }

            {
              !movies.length && <EmptyData />
            }
          </div>
        </div>
      </div>}
    </>



  )
}

export default UserHome
