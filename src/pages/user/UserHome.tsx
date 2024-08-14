import React, { lazy, useEffect, useState } from "react"
// import { Carousel } from "../../component/user/carousel"
const CarouselModule = lazy(() => import('./../../component/user/carousel'))
import { SearchWithFilters } from "../../component/user/footer/SearchWithFilters"
import MovieCard from "../../component/user/MovieCard"
import { AccordionAllOpen } from "../../component/user/Accordian"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../redux/store"
import { IGetMovieShowResponse, IMovie, Role } from "../../interface/Interface"
import { getAllMovies, getAllShows } from "../../redux/actions/userAction"
import { Loader } from "../../component/Loader"
import useAction from "../../hooks/UseAction"

const UserHome: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const { city } = useParams<{ city: string }>();
  const { setCity } = useAction(Role.users)
  const [movies, setMovies] = useState<IMovie[] | []>([])
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  //for fetching theater movies 
  const fetchMovies = async () => {
    try {

      setLoading(true);

      if (city) {

        if (setCity) {
          setCity(city)
        }
        const response = await dispatch(getAllMovies(city)).unwrap()

        setMovies(response)
      } else {
        navigate('/')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies()
  }, [city]);

  // if (loading) return <Loader/> 

  return (
    <>

      <div className="p-2   bg-gray-200">
        <CarouselModule movie={movies} />
        <SearchWithFilters />
        <div className="mx-auto gap-1 flex p-2 bg-gray-200">
          {/* Accordion  */}
          <div className="hidden mt-4 sm:block rounded-lg bg-white h-1/2 flex-shrink-0 w-full sm:w-1/4   p-2">
            <AccordionAllOpen />
          </div>
          {/* Movie cards  */}
          <div className=" grid grid-cols-2 rounded-lg p-1 items-center justify-center mx-auto gap-x-4 gap-y-4 sm:grid-cols-2 sm:p-4 lg:grid-cols-3 lg:xxl:grid-cols-4 xl:gap-x-4">
            {
              movies?.length > 0 &&
              movies.map((movie) => {
                return <Link key={movie._id} to={`/movie/${movie.slug}`}> <MovieCard movie={movie} />  </Link>
              })
            }
          </div>
        </div>
      </div>


    </>
  )
}

export default UserHome
