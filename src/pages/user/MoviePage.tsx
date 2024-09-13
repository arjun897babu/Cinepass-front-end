import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import type { AppDispatch, RootState } from "../../redux/store"
import { IMovie, MovieFilter } from "../../interface/Interface"
import { getSingleMovie } from "../../redux/actions/userAction"
import { Loader } from "../../component/Loader"
import { convertTo12HourFormat, formatRunTime, getIST } from "../../utils/format"
import { IoIosInformationCircle } from "react-icons/io"
import { isResponseError } from "../../utils/customError"
import ShowFilter from "../../component/ShowFilter"

const MoviePage: React.FC = () => {
  const { movieId } = useParams();
  const [searchParams] = useSearchParams();

  const dispatch = useDispatch<AppDispatch>()
  const { city } = useSelector((state: RootState) => state.user)

  const navigate = useNavigate()
  const [movieDetails, setMovieDetails] = useState<IMovie | null>(null);
  const [theaterDetails, setTheaterDetails] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false)
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
        const [response] = await dispatch(getSingleMovie({ city, movieId, filter: filterItem })).unwrap()
        const { movie, theaters } = response
        if (movie) {
          setMovieDetails(movie)
        }
        if (theaters.length >= 1) {
          setTheaterDetails(theaters)
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

  useEffect(() => {
    fetchRunningMovie()
  }, [movieId])

  if (loading) {
    return <Loader />
  }

  if (!movieDetails) {
    return <Loader />
  }

  return (
    <>

      {/* movie section  */}
      < section
        className="relative hidden sm:w-full p-8 sm:flex    bg-cover bg-center bg-no-repeat min-h-[300px]  "
        style={{
          backgroundImage: `url(${movieDetails.cover_photo})`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        {/* movie card  */}
        <div className="flex   max-w-[1240px] mx-auto relative w-full bg-transparent border-0 text-base font-normal m-0 p-0 align-baseline">
          <div className="bg-transparent border-0 text-base font-normal m-0 p-0 align-baseline w-full h-auto max-w-[261px] max-h-[416px] overflow-hidden flex-shrink-0 flex justify-center items-center">
            <img className="w-full h-full " src={movieDetails.movie_poster as string} alt="" />
          </div>
          <div className="p-8 w-4/5 " >
            <h1 className="relative text-white capitalize font-bold text-3xl">{movieDetails.movie_name}</h1>

            <div className="mt-4 flex gap-2">
              <span className="badge rounded-sm  p-4 capitalize tracking-wider font-sans  font-medium ">{movieDetails.format.join(', ')}</span>
              <span className="badge rounded-sm  p-4 capitalize tracking-wider font-sans  font-medium ">{movieDetails.languages.join(', ')}</span>
            </div>
            <div className="mt-4 gap-3 flex relative text-sm text-white">
              <span className=" ">{formatRunTime(movieDetails.run_time)}</span>
              <span className="rounded bg-white p-[1px]"></span>
              <span className="capitalize tracking-wider ">{movieDetails.genres.join(',')}</span>
              <span className="rounded bg-white p-[1px]"></span>
              <span className=" ">{getIST(movieDetails.release_date as string)}</span>
            </div>
          </div>

        </div>

      </section >

      {
        theaterDetails &&
        <>

          <ShowFilter /> 
          {theaterDetails.map((theater) => {
            return <>
              <div className="w-full block sm:flex gap-8 lg:gap-12 p-4 md:p-6 lg:p-9  border-t border-y-1 border-b-gray-200 my-1   rounded-lg border border-gray-300">
                {/* Theater Name */}

                <div className="text-left mb-4 w-1/3 flex-shrink-0">
                  <span className="text-xs lg:text-base font-bold flex items-center gap-2">
                    {theater.theater.theater_name}
                    <IoIosInformationCircle className="mr-3 text-xs lg:text-base text-gray-100 " />
                  </span>
                </div>
                {/* Movie Show */}
                {theater.shows.map((show: any) => {
                  return <>
                    <Link key={show.showDetails.showId} to={`/movie/layout/${show.showDetails.slug}?bookingDate=${getIST(movieDetails.release_date.toString())}`} state={show}>
                      <div className="flex  text-xs">
                        <button className="p-1 px-6 border rounded-lg text-green-500 border-green-500 hover:bg-green-100 transition">
                          {convertTo12HourFormat(show.showDetails.showTime as string)} <br />
                          <span className="text-gray-400">{show.screen_name}</span>
                        </button>
                      </div>
                    </Link>

                  </>
                })}

              </div>
            </>
          })}

        </>
      }

    </>
  )
}

export default MoviePage