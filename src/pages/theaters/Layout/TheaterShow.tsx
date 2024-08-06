import { ChangeEvent, FormEvent, MouseEvent, useEffect, useRef, useState } from "react"
import { FaEdit } from "react-icons/fa"
import { GiCancel } from "react-icons/gi"
import { useForm } from "../../../hooks/UseForm"
import { IMovie, Role } from "../../../interface/Interface"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../redux/store"
import { addMovieShows, getMovie, getScreen } from "../../../redux/actions/theaterAction"
import { MovieType } from "../../../component/admin/AddMovieForm"
import { Loader } from "../../../component/Loader"
import { calculateEndTime, formatEndTime, formatRunTime, getIST, getMovieTime } from "../../../utils/format"
import { IMovieShow } from "../../../interface/theater/IMovieShow"
import { ITheaterScreenResponse } from "../../../interface/theater/ITheaterScreen"
import { useFormSubmit } from "../../../hooks/UseFormSubmitt"

interface ShowModalProps {
  initialData: { [key: string]: string };
}
const ShowFormModal: React.FC<ShowModalProps> = ({ initialData }) => {

  const modalDialogRef = useRef<HTMLDialogElement>(null)
  const openModalBtnRef = useRef<HTMLButtonElement>(null)
  const closeModalBtnRef = useRef<HTMLButtonElement>(null)
  const durationRef = useRef<HTMLInputElement>(null)
  const [movieShows, setMovieShows] = useState<IMovieShow[] | []>([])
  const [screens, setScreens] = useState<ITheaterScreenResponse[] | []>([])
  const [selectedMovie, setSelectedMovie] = useState<string>('')
  const { formData, handleChange, inputError, setFormData, setInputError } = useForm(initialData, Role.theaters)
  const [theaterMovies, setTheaterMovies] = useState<IMovie[] | []>([])
  const [releaseDate, setReleaseDate] = useState('')
  const [duration, setDuration] = useState('')
  const [format, setFormat] = useState<string[]>([])
  const [fetching, setFetching] = useState(false)
  const dispatch = useDispatch<AppDispatch>()

  const fetchScreen = async () => {
    try {
      setFetching((prev) => !prev)
      const response = await dispatch(getScreen()).unwrap();
       
      if (response) {
        return response
      }
    } catch (error) {
      console.log(error)
    } finally {
      setFetching((prev) => !prev)
    }
  }

  //for fetching theater movies 
  const fetchMovies = async () => {
    try {
      setFetching((prev) => !prev)
      const response = await dispatch(getMovie(MovieType.theater)).unwrap()
      setTheaterMovies(response)
    } catch (error) {
      console.log(error)
    } finally {
      setFetching((prev) => !prev)
    }
  }


  const fetchMovieDetails = async (movieId: string) => {
    const selectedMovie = theaterMovies.find((movie) => movie._id === movieId)

    if (selectedMovie) {
      setReleaseDate(getIST(selectedMovie.release_date as string));
      setDuration(selectedMovie.run_time);
      setFormat([selectedMovie.format.join(',')]);
      const theaterScreens = await fetchScreen()
      const filtered = theaterScreens?.filter((screen) => selectedMovie.format.includes(screen.amenity))

      if (filtered) {
        setScreens(filtered ?? [])
      }
    }

  }


  const handleMovieChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setSelectedMovie(value);

    fetchMovieDetails(value);
  };

  useEffect(() => {
    fetchMovies()
  }, [])

  const handleChangeTime = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const { name, value } = e.target

    const [hour, min] = value.split(':').map(Number);

    const [movieHour, movieMin] = getMovieTime(durationRef.current?.value ?? '0')

    const endTime = calculateEndTime(hour, movieHour, min, movieMin)

    setFormData((prev) => ({
      ...prev,
      [name]: value, ['endTime']: endTime
    }));
  }


  const showModal = (e: MouseEvent<HTMLButtonElement>) => {

    e.preventDefault()
    modalDialogRef.current?.showModal()
  };

  const closeModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    modalDialogRef.current?.close();
  };
  const { handleSubmit } = useFormSubmit(formData, setInputError)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const isValid = handleSubmit(e)
    try {
      if (isValid) {
        
        const response = await dispatch(addMovieShows(formData as unknown as IMovieShow)).unwrap()
        console.log(response)
        if (response) {
          window.location.reload();
        }
      }
    } catch (error) {
      console.log(error)
    }
    finally {

    }
  }

  return (

    <>
      <div className="flex justify-end bg">
        <button
          ref={openModalBtnRef}
          onClick={showModal}
          className="btn bg-sky-400 hover:bg-cyan-600"
        >
          Add Show
        </button>
      </div>
      <dialog ref={modalDialogRef} id="addMovieForm" className="modal ">
        <div className="modal-box w-11/12   ">
          <button
            ref={closeModalBtnRef}
            onClick={closeModal}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

          <h3 className="text-2xl font-bold mb-4 text-center ">Add Show</h3>
          <form className="space-y-4 mt-5" onSubmit={onSubmit}>
            {
              fetching ? (<Loader />) :
                (
                  <>
                    {/* Movie selection */}
                    <div className="gap-3 w-full relative flex justify-center items-center text-center">
                      <label className="w-24 font-bold text-left" htmlFor="movie-select">Movie</label>
                      <select value={formData.movieId} id="movie-select" onChange={handleMovieChange} name="movieId" className="select capitalize font-serif w-full border border-black max-w-xs" >
                        {
                          theaterMovies.length > 0 ? (
                            <>
                              <option disabled value=""  >select ...</option>
                              {
                                theaterMovies.map((movie) => (
                                  <option
                                    className="capitalize font-serif"
                                    key={movie._id}
                                    value={movie._id}
                                  >
                                    {movie.movie_name}
                                  </option>
                                ))
                              }
                            </>) :
                            (
                              <option disabled>No movies found</option>
                            )
                        }
                      </select>
                    </div>

                    {/* Release Date */}
                    <div className="gap-3 w-full relative flex justify-center items-center text-center">
                      <label className="w-24 font-bold text-left" htmlFor="release-date">Release Date</label>
                      <input
                        type="text"
                        id="release-date"
                        className="input w-full border border-gray-400 text-gray-500 max-w-xs"
                        placeholder="release date"
                        value={releaseDate}
                        readOnly
                      />
                    </div>

                    {/* Duration */}
                    <div className="gap-3 w-full relative flex justify-center items-center text-center">
                      <label className="w-24 font-bold text-left" htmlFor="duration">Duration</label>
                      <input
                        ref={durationRef}
                        type="text"
                        id="duration"
                        name="duration"
                        className="input w-full border border-gray-400 text-gray-500 max-w-xs"
                        placeholder="duration of the movie"
                        readOnly
                        value={duration + ' min'}
                      />
                    </div>
                    {/* format */}
                    <div className="gap-3 w-full relative flex justify-center items-center text-center">
                      <label className="w-24 font-bold text-left" htmlFor="format">Format</label>
                      <input
                        type="text"
                        id="format"
                        name="format"
                        className="input w-full border border-gray-400 text-gray-500 max-w-xs"
                        placeholder="viewing experience"
                        readOnly
                        value={format}
                      />
                    </div>

                    {/* Screen selection */}
                    <div className="gap-3 w-full relative flex justify-center items-center text-center">
                      <label className="w-24 font-bold text-left" htmlFor="screen-select">Screen</label>

                      <select value={formData.screenId} id="movie-select" onChange={handleChange} name="screenId" className="select capitalize font-serif w-full border border-black max-w-xs" >
                        {
                          screens.length > 0 ? (
                            <>
                              <option disabled value=""  >select ...</option>
                              {
                                screens.map((screen) => (
                                  <option
                                    className="capitalize font-serif"
                                    key={screen._id}
                                    value={screen._id}
                                  >
                                    {screen.screen_name}
                                  </option>
                                ))
                              }
                            </>) :
                            (
                              <option disabled>No screen found</option>
                            )
                        }
                      </select>

                    </div>

                    {/* Time inputs */}
                    <div className="flex justify-evenly">
                      <div className="flex">
                        <label className="font-bold w-24" htmlFor="showTime">Show Time</label>
                        <input
                          type="time"
                          id="showTime"
                          name="showTime"
                          className="border p-2 border-black w-full mt-1"
                          value={formData.showTime}
                          onChange={handleChangeTime}

                        />
                      </div>
                      <div className="flex">
                        <label className="font-bold w-24" htmlFor="endTime">End Time</label>
                        <input
                          type="time"
                          id="endTime"
                          name="endTime"
                          className="border p-2 border-black w-full mt-1"
                          value={formData.endTime}
                          readOnly
                        />
                      </div>
                    </div>

                    {/* Submit button */}
                    <div className="modal-action">
                      <button
                        type="submit"
                        className="btn btn-neutral"
                      >
                        Submit
                      </button>
                    </div>
                  </>
                )
            }

          </form>

        </div>
      </dialog >

    </>

  )
}

const TheaterShow: React.FC = () => {
  const initialData = {
    movieId: '',
    screenId: '',
    showTime: '00:00',
    endTime: '00:00'
  }
  return (
    <>
      <div
        className="flex justify-end items-center mb-6">
        <ShowFormModal initialData={initialData} />
      </div>
      <div
        className="overflow-x-auto overflow-y-hidden">
        <table className="table ">
          {/* head */}
          <thead className=" ">
            <tr>
              <th>
              </th>
              <th className="font-bold text-black">Name</th>
              <th className="font-bold text-black">Show Time</th>
              <th className="font-bold text-black">Screen</th>
              <th className="font-bold text-black text-center">Action</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="  ">
            <tr>
              <th>
                1
              </th>
              <td>
                <div className="flex items-center gap-3   max-w-60  whitespace-nowrap overflow-hidden ">
                  <div className="avatar">
                    <div className="mask h-16 w-16">
                      <img
                        src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                        alt={' poster'} />
                    </div>
                  </div>
                  <div>
                    <div className="max-w-60 font-semibold text-black capitalize  text-ellipsis  whitespace-nowrap overflow-hidden"> movie name </div>
                    <div className="text-sm opacity-50">2h 2m</div>
                    <div className="text-sm opacity-50">29/09/2021</div>
                  </div>
                </div>
              </td>
              <td>
                <span className="badge font-bold rounded-none ">9:00 AM</span>
              </td>
              <td>
                <span className="badge font-bold rounded-none ">Auid 1</span>
              </td>
              <td className="flex justify-center items-center gap-3">

                <button className="btn bg-transparent hover:bg-transparent  border-none hover: join-item text-black"><FaEdit /></button>
                <button className="btn bg-transparent hover:bg-transparent border-none hover: join-item text-red-600"><GiCancel /></button>

              </td>

            </tr>
          </tbody>
          {/* foot */}
          <tfoot>

          </tfoot>
        </table>
      </div>
    </>
  )
}

export default TheaterShow  