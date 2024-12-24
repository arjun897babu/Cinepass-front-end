import { lazy, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { Loader } from "../../component/Loader"
import type { AppDispatch, RootState } from "../../redux/store"
import { getSingleMovie, getUserSingleStreamingMovies } from "../../redux/actions/userAction"
import { convertTo12HourFormat, toValidJSDate } from "../../utils/format"
import { IoIosInformationCircle } from "react-icons/io"
import { isResponseError } from "../../utils/customError"
import {
  IStreamingMovieData,
  ITheaterMovieData,
  MovieFilter,
  MovieType,
  ResponseStatus
} from "../../interface/Interface"

const ShowFilter = lazy(() => import("../../component/ShowFilter"));
const MovieInfoDisplay = lazy(() => import("../../component/user/MovieInfoDisplay"));


const MoviePage: React.FC = () => {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch<AppDispatch>()
  const { city } = useSelector((state: RootState) => state.user)

  const navigate = useNavigate()
  const [movieDetails, setMovieDetails] = useState<ITheaterMovieData | IStreamingMovieData | null>(null);
  const [theaterDetails, setTheaterDetails] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false)
  const [maxAllocatedDays, setMaxAllocatedDays] = useState(3)
  if (!city) {
    navigate('/', { replace: true })
  }
  async function fetchRunningMovie() {
    try {
      if (city && movieId) {
        setLoading(true)
        const filterItem: Partial<MovieFilter> = {}

        const bookingDate = searchParams.get('bookingDate');
        if (bookingDate) {
          filterItem.bookingDate = bookingDate
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        let response
        if (movieId.includes('STR')) {
          response = await dispatch(getUserSingleStreamingMovies(movieId)).unwrap()
          if (response.status === ResponseStatus.SUCCESS) {
            setMovieDetails(response.data as IStreamingMovieData)
          }
        } else {
          [response] = await dispatch(getSingleMovie({ city, movieId, filter: filterItem })).unwrap()
          const { movie, theaters, maxAllocatedDays } = response
          if (movie) {
            setMovieDetails(movie)
          }
          if (theaters.length >= 1) {
            setTheaterDetails(theaters)
          }
          setMaxAllocatedDays(maxAllocatedDays)
        }
      }

    } catch (error) {
      if (isResponseError(error)) {
        if (error.statusCode === 403) {
          navigate('/login', { replace: true, state: { blocked: true } })
        }
      }
    } finally {
      setLoading(false)
    }
  }
  const [filterDate, setFilterDate] = useState<Date | null>(null)
  useEffect(() => {
    fetchRunningMovie()
    const bookingDate = searchParams.get('bookingDate')
    if (bookingDate) {
      setFilterDate(toValidJSDate(bookingDate))
    }
  }, [movieId, searchParams])

  if (loading) {
    return <Loader />
  }

  if (!movieDetails) {
    return <Loader />
  }

  return (
    <>

      {/* movie section  */}
      {
        movieId?.includes('STR') ?
          (
            <MovieInfoDisplay
              movieType={MovieType.stream}
              movieDetails={movieDetails as IStreamingMovieData}
            />
          ) :
          (
            <MovieInfoDisplay
              movieType={MovieType.theater}
              movieDetails={movieDetails as ITheaterMovieData}
            />
          )
      }

      {
        !movieId?.includes('STR') &&
        < ShowFilter
          maxAllocatedDate={maxAllocatedDays}
          bookingDate={new Date(movieDetails.release_date)}
        />
      }

      {
        theaterDetails &&
        <>

          {theaterDetails.map((theater) => {
            return <div key={theater.theater.theater_name} className="w-full block sm:flex gap-8 lg:gap-12 p-4 md:p-6 lg:p-9 rounded-lg  bg-base-100 ">
              {/* Theater Name */}
              <div className="text-left mb-4 w-1/3 flex-shrink-0">
                <span className="text-xs lg:text-base font-bold flex items-center gap-2">
                  {theater.theater.theater_name}
                  <IoIosInformationCircle className="mr-3 text-xs lg:text-base text-gray-100 " />
                </span>
              </div>
              {/* Movie Show */}
              {theater.shows.map((show: any) => {
                return (

                  <div
                    key={show.showDetails.slug} >
                    <Link

                      to={`/movie/layout/${show.showDetails.slug}`}
                      state={{ show, bookingDate: filterDate }}
                    >
                      <div className="flex  text-xs">
                        <button className="p-1 px-6 border rounded-lg text-green-500 border-green-500 hover:bg-green-100 transition">
                          {convertTo12HourFormat(show.showDetails.showTime as string)} <br />
                          <span className="text-gray-400">{show.screen_name}</span>
                        </button>
                      </div>
                    </Link >
                  </div>
                )

              })}

            </div >

          })}

        </>
      }

    </>
  )
}

export default MoviePage