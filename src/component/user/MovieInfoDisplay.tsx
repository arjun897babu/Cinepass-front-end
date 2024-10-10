import { memo, useState } from "react"
import { IStreamingMovieData, ITheaterMovieData, ResponseStatus, Role } from "../../interface/Interface"
import { formatRunTime, getIST } from "../../utils/format"
import { MovieType } from "../admin/MovieForm"
import { FaRegPlayCircle } from "react-icons/fa"
import ConfirmationModal from "../ConfirmationModal"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../redux/store"
import { userGetHlsUrl } from "../../redux/actions/userAction"
import VideoPlayer from "../admin/VideoPlayer"

const MovieInfoDisplay: React.FC<{ movieType: MovieType, movieDetails: ITheaterMovieData | IStreamingMovieData }> = ({ movieType, movieDetails }) => {

  const dispatch = useDispatch<AppDispatch>()
  const [confirmation, setConfirmation] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [hlsURL, setHlsURL] = useState<string | null>(null)

  const makePurchase = () => {
    if (!movieDetails) {
      return
    }
    setConfirmation(true)
  }

  const onPurchaseConfirm = () => {
    navigate('/payment', { replace: true, state: { bookingDate: new Date(), streamingData: movieDetails } })
  }



  const getStreamingUrl = async () => {
    try {
      if ('file' in movieDetails) {
        setLoading(true)

        const response = await dispatch(userGetHlsUrl(
          {
            movieId: movieDetails._id,
            publicId: movieDetails.file.public_id
          }
        )).unwrap()
        
        if (response.status === ResponseStatus.SUCCESS) {
          setHlsURL(response.data.hlsURL)
        }
      }

    } catch (error) {

      console.log(error)


    } finally {

      setLoading(false)
    }
  }



  return (
    <>

      {
        confirmation && 'streamingPlan' in movieDetails &&
        <ConfirmationModal
          btnType={ResponseStatus.SUCCESS}
          isOpen={confirmation}
          message={'By continuing, I agree to  Terms and Conditions and express my consent to complete the transaction.'}
          onClose={() => setConfirmation(false)}
          onConfirm={onPurchaseConfirm}
          payment={true}
          plan={movieDetails.streamingPlan}
        />
      }

      {/* movie section  */}
      <section
        className={`${hlsURL ? 'hidden' : 'relative   p-4 sm:p-8 flex bg-no-repeat  bg-cover'}`}
        style={{
          backgroundImage: `url(${movieDetails.cover_photo})`,
        }}
      >

        <div className="absolute inset-0 bg-black bg-opacity-70"></div>

        {/* movie card */}
        <div className="relative z-2 flex flex-col  sm:flex-row  w-full sm:w-auto text-base font-normal m-0 p-0 align-baseline sm:justify-start">

          {/* Movie Poster */}

          <div className="flex-shrink-0 flex justify-center  items-center bg-transparent border-0 w-full sm:max-w-[261px] sm:max-h-[416px] overflow-hidden">
            <img
              className=" object-scale-down sm:h-full sm:object-fill"
              src={movieDetails.movie_poster as string}
              alt={movieDetails.movie_name}
            />
          </div>

          {/* Movie Details */}

          <div className="p-4 sm:p-8 w-full sm:w-4/5 flex flex-col justify-center gap-2">
            {
              movieType === MovieType.stream &&
              <div className="badge capitalize m-0 p-3 badge-xs font-bold gap-2  badge-neutral">
                streaming now <FaRegPlayCircle size={10} />
              </div>
            }
            <h1 className="text-white capitalize font-bold text-2xl sm:text-3xl">{movieDetails.movie_name}</h1>

            {/* Formats and Languages */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="badge rounded-sm px-3 py-2 capitalize tracking-wider font-sans font-medium">
                {movieDetails.format.join(', ')}
              </span>
              <span className="badge rounded-sm px-3 py-2 capitalize tracking-wider font-sans font-medium">
                {movieDetails.languages.join(', ')}
              </span>
            </div>

            {/* Release Date, Runtime, Genres */}
            <div className="mt-4 gap-3 flex flex-wrap text-sm text-white">
              <span>{formatRunTime(movieDetails.run_time)}</span>
              <span className="rounded bg-white p-[1px]"></span>
              <span className="capitalize tracking-wider">{movieDetails.genres.join(', ')}</span>
              <span className="rounded bg-white p-[1px]"></span>
              <span>{getIST(movieDetails.release_date.toString())}</span>
            </div>
            {/* for streaming movie */}
            {
              movieType === MovieType.stream && 'streamingPlan' in movieDetails && location.pathname.includes('/movie')
              &&

              <div className="mt-4 text-sm" >
                <button
                  onClick={!movieDetails.isPurchased ? makePurchase : getStreamingUrl}
                  className="btn btn-wide bg-pink-600 border-0 hover:bg-pink-700"
                >{
                    movieDetails.isPurchased ?
                      loading ? <div className="loading loading-xs"></div> : <FaRegPlayCircle className="text-white" size={30} />
                      : `Rent ₹${movieDetails.streamingPlan.price}`
                  }
                </button>
              </div>
            }
          </div>
        </div>
      </section>


      {/*  */}

      {
        hlsURL && <VideoPlayer role={Role.users} url={hlsURL} removeHlsUrl={() => setHlsURL(null)} />
      }
    </>
  )
}


export default memo(MovieInfoDisplay)