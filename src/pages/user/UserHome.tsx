import React,
{
  lazy,
  useState
} from "react"

const EmptyData = lazy(() => import("../../component/EmptyData"))
const MovieCard = lazy(() => import("../../component/user/MovieCard"))
const CarouselSlider = lazy(() => import("../../component/user/CarouselSlider"))


import { SearchWithFilters } from "../../component/user/footer/SearchWithFilters"
import Accordion from "../../component/user/Accordion"
import { shallowEqual, useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import { MovieFilter, MovieType } from "../../interface/Interface"
import { isFilterEmpty } from "../../utils/validator"
import LocationModal from "./LocationModal"


const UserHome: React.FC = () => {
  const [filterItem, setFilterItem] = useState<Partial<MovieFilter> | null>(null)

  const setFilter = (filterItem: Partial<MovieFilter> | null) => {
    setFilterItem(filterItem)
  }

  const { movies, city } = useSelector((state: RootState) => ({ movies: state.user.movies, city: state.user.city }), shallowEqual)

  if (movies===undefined && isFilterEmpty(filterItem)) {
    return (
      <div className="flex justify-center items-centre">
        {
          !city &&
          <LocationModal />
        }
        {
          movies !== undefined &&
          <EmptyData />
        }
      </div>
    )
  };


  return (

    <>
      <div className="p-2   bg-gray-200">
        <CarouselSlider movieType={MovieType.theater} />
        <SearchWithFilters
          setFilter={setFilter}
        />
        <div className="mx-auto gap-1 sm:flex p-2 bg-gray-200">
          {/* Accordion  */}
          <div className="sm:mt-4  rounded-lg  bg-white h-1/2 flex-shrink-0 w-full  sm:w-2/5 lg:w-1/4 ">
            <Accordion
              setFilter={setFilter}
            />
          </div>
          {/* Movie cards  */}
          <div className={` ${!movies && !isFilterEmpty(filterItem) ? "flex justify-center w-full" : "grid grid-cols-2 rounded-lg p-1 items-center justify-center mx-auto gap-x-4 gap-y-4 sm:grid-cols-2 sm:p-4 lg:grid-cols-3 lg:xxl:grid-cols-4 xl:gap-x-4"}`}>
            <MovieCard />
          </div>
        </div>
      </div>
    </>
  )
}

export default UserHome
