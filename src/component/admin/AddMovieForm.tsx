import React, { ChangeEvent, MouseEvent, RefObject, useRef, useState } from "react";
import { SubmitHandler, useForm as useForms } from 'react-hook-form'

import { IMovie, ResponseData, ResponseStatus } from "../../interface/Interface";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { addMovie } from "../../redux/actions/adminAction";
import { isReponseError, UploadError } from "../../utils/customError";

import { Genre, Language, MovieFormat } from "../../utils/validator";
import { movieSchema } from "../../utils/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { IoCloudUploadOutline } from "react-icons/io5";
import { convertFile } from "../../utils/format";

export enum MovieType {
  theater = 'Theater',
  stream = 'Stream'
}
interface AddMovieFormProps {
  movieType: MovieType;
  setToast: (alert: ResponseStatus, message: string) => void
  updateMovieData: (movieData: IMovie) => void
  closeButtonRef: RefObject<HTMLDialogElement>
  selectedData?: IMovie
  closeModal: () => void
}


interface MultiSelectComponentProps {
  field: string
  defaultValues: string[];
  handleAddValue: (name: keyof IMovie, value: string) => void;
}

const MultiSelectComponent: React.FC<MultiSelectComponentProps> = ({ field, defaultValues, handleAddValue }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const toggleDropdown = () => setIsOpen(!isOpen);


  const handleSelection = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];

    setSelectedValues(newSelectedValues);
    handleAddValue(field as keyof IMovie, value);
  };
  return (
    <div className="relative">
      <div className="flex items-center">
        <input
          type="text"
          readOnly
          value={selectedValues.join(', ') || 'Choose options'}
          onClick={toggleDropdown}
          className="input input-bordered flex-1 cursor-pointer"
        />
      </div>

      {isOpen && (
        <div className="absolute bg-white border rounded shadow-lg mt-2 w-full max-h-60 overflow-auto z-50">
          <ul className="p-2">
            {defaultValues.map((value) => (
              <li key={value} className="flex capitalize items-center p-2 cursor-pointer hover:bg-gray-200  ">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(value)}
                  onChange={() => handleSelection(value)}
                  className="mr-2"
                />
                {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};




export const AddMovieForm: React.FC<AddMovieFormProps> = ({ movieType, updateMovieData, closeButtonRef, selectedData, setToast, closeModal }) => {

  const initialMovieData = {
    movie_name: '',
    release_date: '',
    run_time: ' ',
    genres: [],
    languages: [],
    format: [],
    cover_photo: '',
    movie_poster: '',
  };


  const dispatch = useDispatch<AppDispatch>()

  const [loading, setLoading] = useState<boolean>(false);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [moviePoster, setMoviePoster] = useState<File | null>(null);
  const coverPhotoRef = useRef<HTMLInputElement>(null)
  const moviePosterRef = useRef<HTMLInputElement>(null)
  const {
    register,
    handleSubmit,
    clearErrors,
    reset,
    watch,
    setValue,
    setError,
    formState: { errors }
  } = useForms<IMovie>(
    {
      resolver: zodResolver(movieSchema),
      defaultValues: selectedData || initialMovieData
    }
  )

  const handleAddValue = (field: keyof IMovie, value: string) => {
    const currentValues = watch(field) as string[];
    const updatedArray = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    clearErrors(field)
    setValue(field, updatedArray);
  };


  const openFile = (e: MouseEvent<HTMLButtonElement>, imageField: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (imageField === 'movie_poster') {
      moviePosterRef.current?.click();
    } else if (imageField === 'cover_photo') {
      coverPhotoRef.current?.click();
    }
  }



  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, imageType: string) => {
    e.preventDefault();
    const file = e.target.files?.[0] || null;

    imageType === 'cover_photo' ?
      setCoverPhoto(file || null)
      : setMoviePoster(file || null)

    file ?
      convertFile(file)
        .then((result) => {
          setValue(imageType as keyof IMovie, result)
          clearErrors(imageType as keyof IMovie)
        })
        .catch((error) => {
          if (error instanceof UploadError) {

            setToast(ResponseStatus.ERROR, error.message)
          }
        })
      : null
  }


  const onSubmit: SubmitHandler<IMovie> = async (movieData) => {

    try {
      setLoading(true)
      clearErrors()
      const response = await dispatch(addMovie({
        movieData,
        movieType: MovieType.theater
      })).unwrap();

      if (response) {
        setToast(ResponseStatus.SUCCESS, 'Movie Added Successfully')
        updateMovieData(response)
        closeButtonRef.current?.close()
        clearErrors()
        reset()
        closeModal()
      }

    } catch (err) {

      //error during upload the image
      if (err instanceof UploadError) {

        setToast(ResponseStatus.ERROR, err.message)
      }

      //error during the submission
      else if (isReponseError(err)) {
        if (err.statusCode === 413) {
          setToast(ResponseStatus.ERROR, err.data.message)
        }
        setError(
          err.data.error as keyof IMovie,
          {
            message: err.data.message
          })

      } else {
        setToast(ResponseStatus.ERROR, 'Too large')
      }

    } finally {
      setLoading(false)
    }


  }

  return (
    <>


      <form className="grid grid-cols-1 gap-4 p-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="relative col-span-2">
          <label className=" label block mb-2" htmlFor="movie_name">Movie Name</label>
          <input

            className="relative input input-bordered w-full max-w-md"
            type="text"
            {...register('movie_name')}

            placeholder="Enter movie name"
          />
          {errors.movie_name &&
            <small
              className='text-red-600 capitalize absolute left-0 -bottom-6 font-mono '
            >{errors.movie_name.message}</small>
          }

        </div>
        <div className="relative flex  gap-2 items-center">
          <div className="flex relative flex-col">
            <label className="label">Genres</label>
            <MultiSelectComponent
              field="genres"
              defaultValues={Object.values(Genre)}
              handleAddValue={handleAddValue}
            />
            {errors.genres &&
              <small
                className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '
              >{errors.genres.message}</small>}

          </div>
          <div className="relative flex flex-col">
            <label className="label">Language</label>
            <MultiSelectComponent
              field={'languages'}
              defaultValues={Object.values(Language)}
              handleAddValue={handleAddValue}
            />
            {errors.languages &&
              <small
                className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '
              >{errors.languages.message}</small>}

          </div>
          <div className="relative flex flex-col">
            <label className="label">Select Format</label>
            <MultiSelectComponent
              field={'format'}
              defaultValues={Object.values(MovieFormat)}
              handleAddValue={handleAddValue}
            />
            {errors.format &&
              <small
                className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '
              >{errors.format.message}</small>}

          </div>
        </div>
        {movieType === MovieType.stream && (
          <div className="relative col-span-2">
            <label className="label block mb-2">Choose plan</label>
            <select name="plan" id="plan" className="select">
              <option value="">Select plan</option>
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        )}
        <div className="relative col-span-2">
          <label className="label block mb-2">Release Date</label>
          <input
            className="input input-bordered w-full max-w-xs"
            type="date"
            {...register('release_date')}
          />
          {errors.release_date &&
            <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '
            >{errors.release_date.message}</small>}

        </div>
        <div className="relative col-span-2">
          <label className="label block mb-2">Run time</label>
          <input
            type="number"
            {...register('run_time')}
            className="input input-bordered w-full max-w-xs" placeholder="Movie running time (minutes)"
          />
          {errors.run_time &&
            <small
              className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '
            >{errors.run_time.message}</small>}
        </div>

        {/* Movie Poster */}
        <div className="relative col-span-2 my-5">
          <label
            className=" gap-3  bg-sky-300 p-2 mb-2 rounded-md "

          >
            Movie Poster
          </label>

          <button type="button" onClick={(e) => openFile(e, 'movie_poster')} className="ml-2">
            <IoCloudUploadOutline size={20} />

          </button>
          <input
            type="file"
            id="movie_poster"
            ref={moviePosterRef}
            onChange={(e) => handleImageUpload(e, 'movie_poster')}
            accept="image/*,.jpg,.jpeg,.avif"
            className="hidden"
          />
          {errors.movie_poster && (
            <small className="text-red-600 absolute left-0 -bottom-6 font-mono">
              {errors.movie_poster.message}
            </small>
          )}
        </div>

        {/* Cover Photo */}
        <div className="relative col-span-2 mb-3">
          <label
            className=" gap-3  bg-sky-300 p-2 mb-2 rounded-md "

          >
            Cover Photo
          </label>
          <button type="button" onClick={(e) => openFile(e, 'cover_photo')} className="ml-2">
            <IoCloudUploadOutline size={20} />
          </button>
          <input
            type="file"
            id="cover_photo"
            ref={coverPhotoRef}
            onChange={(e) => handleImageUpload(e, 'cover_photo')}
            accept="image/*,.jpg,.jpeg,.avif"
            className="hidden"
          />

          {errors.cover_photo && (
            <small className="text-red-600 absolute left-0 -bottom-6 font-mono">
              {errors.cover_photo.message}
            </small>
          )}
        </div>


        <div className="text-center">
          <button
            type='submit'
            className="mt-3 btn bg-cyan-400 hover:bg-cyan-500 w-2/3"
            disabled={loading}
          >
            {
              !loading ? ('SUBMIT')
                :
                (
                  <span className="loading loading-bars loading-md"></span>
                )
            }</button>

        </div>
      </form>
    </>
  );
}
export default AddMovieForm;

