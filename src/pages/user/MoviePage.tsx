import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { AppDispatch } from "../../redux/store"
import { useLoggedOwner } from "../../hooks/useLoggedUser"
import { IMovie, Role } from "../../interface/Interface"
import { getSingleMovie } from "../../redux/actions/userAction"
import { Loader } from "../../component/Loader"
import { formatRunTime, formatTime, getIST } from "../../utils/format"
import { IoIosInformationCircle } from "react-icons/io"

const MoviePage: React.FC = () => {
  const { movieId } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const { city } = useLoggedOwner(Role.users)
  const navigate = useNavigate()
  const [movieDetails, setMovieDetails] = useState<IMovie | null>(null);
  const [theaterDetails, setTheaterDetails] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false)
  if (!city) {
    navigate('/')
  }
  async function fetchRunningMovie() {

    try {
      if (city && movieId) {
        setLoading(true)
        const [response] = await dispatch(getSingleMovie({ city, movieId })).unwrap()
        const { movie, theaters } = response
        if (movie) {
          setMovieDetails(movie)
        }
        if (theaters.length >= 1) {
          setTheaterDetails(theaters)
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRunningMovie()
  }, [movieId])
  
   return (

    <>
      {loading && <Loader />}

      {movieDetails &&
        <>

          {/* movie section  */}
          < section
            className="relative hidden bg-cover bg-center  sm:w-full p-8 sm:flex bg-no-repeat   min-h-[480px]  "
            style={{
              backgroundImage: `  url(${movieDetails.cover_photo})`,
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
                  <span className="badge rounded-sm font-sans p-4  ">{movieDetails.format.join(',')}</span>
                  <span className="badge rounded-sm font-sans p-4  ">{movieDetails.languages.join(',')}</span>
                </div>
                <div className="mt-4 gap-3 flex relative text-sm text-white">
                  <span className=" ">{formatRunTime(movieDetails.run_time)}</span>
                  <span className="rounded bg-white p-[1px]"></span>
                  <span className=" ">{movieDetails.genres.join(',')}</span>
                  <span className="rounded bg-white p-[1px]"></span>
                  <span className=" ">{getIST(movieDetails.release_date as string)}</span>
                </div>
              </div>

            </div>

          </section >

          {
            theaterDetails &&

            theaterDetails.map((theater) => {
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
                      <div className="flex  text-xs">
                        <button className="p-1 px-6 border rounded-lg text-green-500 border-green-500 hover:bg-green-100 transition">
                          {show.showDetails.showTime as string} <br />
                          <span className="text-gray-400">{show.screen_name}</span>
                        </button>
                      </div>
                    </>
                  })}

                </div>
              </>
            })

          }

        </>
      }
    </>



  )
}

export default MoviePage