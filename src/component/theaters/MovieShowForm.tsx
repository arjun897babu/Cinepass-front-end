import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { Action, IMovie, ResponseStatus } from "../../interface/Interface";
import { Controller, SubmitHandler, useForm as useForms } from "react-hook-form";
import { ITheaterScreenResponse } from "../../interface/theater/ITheaterScreen";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";
import { addMovieShows, getMovie, getScreen } from "../../redux/actions/theaterAction";
import { MovieType } from "../admin/MovieForm";
import { calculateEndTime, getIST, getMovieTime, setDefaultDate } from "../../utils/format";
import { IMovieShow } from "../../interface/theater/IMovieShow";
import { Toast } from "../Toast2";
import { zodResolver } from "@hookform/resolvers/zod";
import { movieShowSchema } from "../../utils/zodSchema";
import ConfirmationModal from "../ConfirmationModal";
import { isResponseError } from "../../utils/customError";

interface ShowModalProps {
  id: string;
  action: Action,
  setToast: (toast: Toast) => void
  // updateMovieShowState: () => void
  closeModal: () => void
  initialData?: IMovieShow
}
const MovieShowForm: React.FC<ShowModalProps> = ({ initialData =
  {
    movieId: '',
    screenId: '',
    language: '',
    format: '',
    opening_date: 'dd-mm-yy',
    showTime: '',
    endTime: '',
  }, action, closeModal, id, setToast }) => {

  const modalRef = useRef<HTMLDialogElement>(null) // to control over modal
  const closeModalBtnRef = useRef<HTMLButtonElement>(null);//for closing the modal

  const [theaterMovies, setTheaterMovies] = useState<IMovie[] | []>([])//store available theaer movies
  const [screens, setScreens] = useState<ITheaterScreenResponse[] | []>([])//store available screens based on the movie format
  const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null)
  const [formData, setFormData] = useState<IMovieShow>()
  const [releaseDate, setReleaseDate] = useState('');
  const [duration, setDuration] = useState('');
  const [format, setFormat] = useState<string[]>([]);

  const [confirmation, setConfirmation] = useState(false)

  const durationRef = useRef<HTMLInputElement>(null)
  const openingDateRef = useRef<HTMLInputElement>(null);

  const [fetching, setFetching] = useState(false);//for loading icon


  const dispatch = useDispatch<AppDispatch>()

  const closeConfirmationModal = () => setConfirmation(false)

  const fetchScreen = async () => {
    try {
      // console.log('calling last after selection a movie')
      const response = await dispatch(getScreen()).unwrap();

      if (response) {
        return response
      }
    } catch (error) {
      console.log(error)
    } finally {

    }
  }

  //for fetching theater movies 
  const fetchMovies = async () => {
    // console.log('movie fetchin 2nd')
    try {
      setFetching(true);
      const response = await dispatch(getMovie(MovieType.theater)).unwrap();
      console.log("Fetched Movies:", response);
      setTheaterMovies(response);
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
      // console.log('Fetching completed');
    }
  };

  useEffect(() => {
    // console.log('use effect is called 1st')
    fetchMovies()
      .then(() => {
        if (modalRef.current) {
          // console.log('modal is opeing 3')
          modalRef.current.showModal();
        }
      })
      .catch(error => {
        // console.error("Error in useEffect:", error);
      });
  }, []);

  useEffect(() => {
    if (initialData.movieId && theaterMovies.length > 0) {
      // console.log('form ready for updation');
      // console.log('updation movie id:', initialData.movieId);
      saveSelectMovie(initialData.movieId);
    }
  }, [initialData.movieId, theaterMovies]);
  const handleFormSubmit: SubmitHandler<IMovieShow> = (data) => {
    // console.log(data)
    setConfirmation(true)
    setFormData(data)

  }

  //when movie select need to set some field automatically. the duration and relaese date are not part of the form but need to show as read only
  const handleMovieChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const { value } = e.target;
    saveSelectMovie(value)
  };


  const saveSelectMovie = async (movieId: string) => {
    console.log('calling 4th')
    console.log("Theater Movies State:", theaterMovies);
    const selectedMovie = theaterMovies.find((movie) => movie._id === movieId)
    console.log('movie Id:', movieId);
    console.log('selected movie:', selectedMovie);
    if (selectedMovie) {
      setSelectedMovie(selectedMovie)
      setReleaseDate(getIST(selectedMovie.release_date as string));
      setDuration(selectedMovie.run_time);
      setFormat([selectedMovie.format.join(',')]);

      const min = new Date().toISOString().split('T')[0]
      const max = setDefaultDate(selectedMovie.release_date as Date, -1);

      if (openingDateRef.current) {
        openingDateRef.current.min = min
        openingDateRef.current.max = max
        setValue('opening_date', min)
      }

      const theaterScreens = await fetchScreen()
      const filtered = theaterScreens?.filter((screen) => selectedMovie.format.includes(screen.amenity))
      if (filtered) {
        setScreens(filtered ?? [])
      }
    }
  }

  //for setting up the start time and end time
  const handleChangeTime = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const { value } = e.target
    const [hour, min] = value.split(':').map(Number);
    const [movieHour, movieMin] = getMovieTime(durationRef.current?.value ?? '0')
    const endTime = calculateEndTime(hour, movieHour, min, movieMin)
    setValue('endTime', endTime)

  }

  //closing modal by clicking the cross icon
  const closeModalAction = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    modalRef.current?.close();
    closeModal()
  };
  //this should perfom action for adding or updating the screen

  const onSubmit = async () => {


    try {
      if (formData) {

        if (action === Action.ADD) {
          const response = await dispatch(addMovieShows(formData)).unwrap()
          if (response.status === ResponseStatus.SUCCESS) {

            localStorage.setItem('toastMessage', JSON.stringify({
              alert: ResponseStatus.SUCCESS,
              message: response.message,
            }));

            
            window.location.reload();

          }
        } else {

        }
      }

    } catch (error) {
      if (isResponseError(error)) {
        console.log(error)
      }
    }
    finally {
      setConfirmation(false)

    }
  }

  const {

    clearErrors,
    control,
    setError,
    setValue,
    register,
    reset, handleSubmit,
    formState: { errors }
  } = useForms({
    resolver: zodResolver(movieShowSchema),
    defaultValues: initialData
  })


  return (

    <>

      {
        confirmation &&
        <ConfirmationModal
          btnType={ResponseStatus.SUCCESS}
          isOpen={confirmation}
          message='are you sure'
          onClose={closeConfirmationModal}
          onConfirm={onSubmit}
        />
      }
      <dialog ref={modalRef} id={`${id} form`} className="modal ">
        <div className="modal-box w-11/12   ">
          <button
            ref={closeModalBtnRef}
            onClick={closeModalAction}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

          <h3 className="text-2xl font-bold mb-4 text-center ">{action} Show</h3>
          <form className="space-y-7 mt-5" onSubmit={handleSubmit(handleFormSubmit)}>
            <>
              {/* Movie selection */}
              <div className="gap-3 w-full relative flex justify-center items-center text-center">
                <label className="w-20 font-bold text-left" htmlFor="movie-select">Movie</label>
                {

                  fetching ?
                    (
                      <div className="input w-full  border-gray-400 text-gray-500 max-w-xs">

                        <span
                          className="loading input max-w-full "></span>
                      </div>
                    ) :
                    (
                      theaterMovies.length > 0 ?
                        (
                          <Controller
                            name="movieId"
                            control={control}
                            render={({ field }) => (
                              <select
                                id="movie-select"
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  handleMovieChange(e);
                                }}
                                className="select capitalize font-serif w-full border border-black max-w-xs"
                              >
                                <option value="">select ...</option>
                                {theaterMovies.map((movie) => (
                                  <option
                                    className="capitalize p-2 rounded-none font-serif"
                                    key={movie._id}
                                    value={movie._id}
                                  >
                                    {movie.movie_name}
                                  </option>
                                ))}
                              </select>
                            )}
                          />
                        ) :
                        (
                          <input
                            type="text"
                            className="input w-full border border-gray-400 text-gray-500 max-w-xs"
                            placeholder="no movies found"
                            readOnly
                          />
                        )
                    )
                }
                {errors.movieId &&
                  <small
                    className='text-red-600 capitalize absolute -bottom-5 left-28 font-mono '
                  >{errors.movieId.message}</small>}
              </div>

              {/* Release Date */}
              <div className="gap-3 w-full relative flex justify-center items-center text-center">
                <label className="w-20 font-bold text-left" htmlFor="release-date">Release Date</label>
                <input
                  type="text"
                  id="release-date"
                  className="input w-full border border-gray-400 text-gray-500 max-w-xs"
                  placeholder="release date"
                  value={releaseDate}
                  readOnly
                />
              </div>
              {/* opening Date */}
              <div className="gap-3 w-full relative flex justify-center items-center text-center">
                <label className="w-20 font-bold text-left" htmlFor="opening_date">Opening Date</label>
                <input
                  ref={openingDateRef}
                  type="date"
                  {...register}
                  id="opening_date"
                  className="input w-full border border-gray-400 text-gray-500 max-w-xs"
                  placeholder="opening date"
                  disabled={!selectedMovie}
                />
                {errors.opening_date &&
                  <small
                    className='text-red-600 capitalize absolute -bottom-5 left-28 font-mono '
                  >{errors.opening_date.message}</small>}
              </div>

              {/* Duration */}
              <div className="gap-3 w-full relative flex justify-center items-center text-center">
                <label className="w-20 font-bold text-left" htmlFor="duration">Duration</label>
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
                <label className="w-20 font-bold text-left" htmlFor="format">Format</label>
                {
                  selectedMovie ? (

                    <Controller
                      name="format"
                      control={control}
                      render={({ field }) => (
                        <select
                          id="format-select"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                          }}
                          className="select capitalize font-serif w-full border border-black max-w-xs"
                          disabled={!selectedMovie}
                        >
                          <option value="">Select format...</option>
                          {selectedMovie.format.map((format, i) => (
                            <option key={`${format}-${i}`} value={format}>
                              {format}
                            </option>
                          ))}
                        </select>
                      )}

                    />
                  ) :
                    (
                      <input
                        type="text"
                        className="input w-full border border-gray-400 text-gray-500 max-w-xs"
                        placeholder="choose movie"
                        readOnly
                      />
                    )
                }
                {errors.format &&
                  <small
                    className='text-red-600 capitalize absolute -bottom-5 left-28 font-mono '
                  >{errors.format.message}</small>}
              </div>

              {/* Screen selection */}
              <div className="gap-3 w-full relative flex justify-center items-center text-center">
                <label className="w-20 font-bold text-left" htmlFor="screen-select">Screen</label>

                {
                  selectedMovie ?
                    (
                      <Controller
                        name="screenId"
                        control={control}
                        render={({ field }) => (
                          <select
                            id="movie-select"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                            }}
                            disabled={!selectedMovie}
                            className="select capitalize  relative   w-full border border-black max-w-xs"
                          >
                            <option value="">Select a screen...</option>
                            {selectedMovie && screens.map((screen) => (
                              <option key={screen._id} value={screen._id}>
                                {screen.screen_name} - {screen.amenity}
                              </option>
                            ))}
                          </select>
                        )}
                      />
                    ) :
                    (
                      <input
                        type="text"
                        className="input w-full border border-gray-400 text-gray-500 max-w-xs"
                        placeholder="chosse movie"
                        readOnly
                      />
                    )


                }
                {errors.screenId &&
                  <small
                    className='text-red-600 capitalize absolute -bottom-5 left-28 font-mono '
                  >{errors.screenId.message}</small>}
              </div>

              {/* language selection */}
              <div className="gap-3 w-full relative flex justify-center items-center text-center">
                <label className="w-20 font-bold text-left" htmlFor="langauge-select">language</label>

                {
                  selectedMovie ?

                    (
                      <>
                        <Controller

                          name="language"
                          control={control}
                          render={({ field }) => (
                            <select
                              id="language-select"
                              {...field}
                              className="select capitalize font-serif w-full border border-black max-w-xs"
                            >
                              <option disabled value=""  >select ...</option>
                              {
                                selectedMovie.languages.map((language, i) => (
                                  <option
                                    className="capitalize font-serif"
                                    key={`${language}-${i}`}
                                    value={language}
                                  >
                                    {language}
                                  </option>
                                ))
                              }
                            </select>
                          )}
                        />
                      </>
                    )
                    :
                    (
                      <input
                        type="text"
                        className="input w-full border border-gray-400 text-gray-500 max-w-xs"
                        placeholder="choose movie"
                        readOnly
                      />
                    )
                }
                {errors.language &&
                  <small
                    className='text-red-600 capitalize absolute -bottom-5 left-28 font-mono '
                  >{errors.language.message}</small>}

              </div>

              {/* Time inputs */}
              <div className="flex justify-evenly  ">
                <div className="flex relative">
                  <label className="font-bold w-20" htmlFor="showTime">Show Time</label>
                  <Controller
                    name="showTime"
                    control={control}
                    render={({ field }) =>
                      <input
                        type="time"
                        id="showTime"
                        {...field}
                        disabled={!selectedMovie}
                        onChange={(e) => {
                          field.onChange(e);
                          handleChangeTime(e);
                        }}
                        className="border p-2 border-black w-full mt-1"
                      />
                    }

                  />
                  {errors.showTime &&
                    <small
                      className='text-red-600 capitaliFze absolute -bottom-5 left-14 font-mono '
                    >{errors.showTime.message}</small>}

                </div>
                <div className="flex relative">
                  <label className="font-bold w-20" htmlFor="endTime">End Time</label>
                  <Controller
                    name="endTime"
                    control={control}
                    render={({ field }) =>
                      <input
                        type="time"
                        id='endTime'
                        {...field}
                        className="border p-2 border-black w-full mt-1  "
                      />
                    }
                  />
                  {errors.endTime &&
                    <small
                      className='text-red-600 capitalize absolute -bottom-5 left-28 font-mono '
                    >{errors.endTime.message}</small>}
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
          </form >

        </div >
      </dialog >

    </>

  )
}

export default MovieShowForm