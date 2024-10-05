import React, { lazy, Suspense, useEffect, useState } from "react"

import { SearchWithFilters } from "../../component/user/footer/SearchWithFilters"
const MovieCard = lazy(() => import("../../component/user/MovieCard"))
import Accordion from "../../component/user/Accordion"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"

const EmptyData = lazy(() => import("../../component/EmptyData"))
import LocationModal from "./LocationModal"
import { MovieFilter } from "../../interface/Interface"
import { isFilterEmpty } from "../../utils/validator"
const CarouselSlider = lazy(() => import("../../component/user/CarouselSlider"))
import { MovieType } from "../../component/admin/MovieForm"
import { Loader } from "../../component/Loader"


const UserHome: React.FC = () => {

  const [filterItem, setFilterItem] = useState<Partial<MovieFilter> | null>(null)
  const [loading, setLoading] = useState(true);

  const setFilter = (filterItem: Partial<MovieFilter> | null) => {
    setFilterItem(filterItem)
  }

  const { movies } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (movies !== undefined) {
      setLoading(false);
    }
  }, [movies]);

  if (loading) {
    return (
      <Loader />
    );
  }

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
      <div className="p-2   bg-gray-200">
        <CarouselSlider movieType={MovieType.theater} />
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
          <div className={` ${!movies && !isFilterEmpty(filterItem) ? "flex justify-center w-full" : "grid grid-cols-2 rounded-lg p-1 items-center justify-center mx-auto gap-x-4 gap-y-4 sm:grid-cols-2 sm:p-4 lg:grid-cols-3 lg:xxl:grid-cols-4 xl:gap-x-4"}`}>
            <MovieCard />
          </div>
        </div>
      </div>
    </>



  )
}

export default UserHome
