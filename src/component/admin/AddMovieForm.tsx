import React, { FormEvent, RefObject, useState } from "react";
import { useMultiValueForm } from "../../hooks/UseMultiValueForm";
import { useForm } from "../../hooks/UseForm";
import { IMovie, Role } from "../../interface/Interface";
import { useFormSubmit } from "../../hooks/UseFormSubmitt";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { addMovie } from "../../redux/actions/adminAction";

export enum MovieType {
  theater = 'Theater',
  stream = 'Stream'
}

interface MultiSelectComponentProps {
  field: string
  values: string[];

  handleAddValue: (key: string, value: string) => void;
}

const MultiSelectComponent: React.FC<MultiSelectComponentProps> = ({ field, values, handleAddValue, }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const toggleDropdown = () => setIsOpen(!isOpen);


  const handleSelection = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];

    setSelectedValues(newSelectedValues);
    handleAddValue(field, value);
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
            {values.map((value) => (
              <li key={value} className="flex items-center p-2 cursor-pointer hover:bg-gray-200  ">
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

interface AddMovieFormProps {
  movieType: MovieType;
  updateMovieData: (movieData: IMovie) => void
  closeButtonRef: RefObject<HTMLDialogElement>
}

export const AddMovieForm: React.FC<AddMovieFormProps> = ({ movieType, updateMovieData, closeButtonRef }) => {

  const multiInitialValue = {
    genres: [] as string[],
    languages: [] as string[],
    format: [] as string[]
  };

  const formDataInitialValue = {
    movie_name: '',
    release_date: '',
    run_time: ''
  }

  const dispatch = useDispatch<AppDispatch>()
  const { multiValueFormData, handleAddValue,setMultiValueFormData } = useMultiValueForm(multiInitialValue);
  const { formData, handleChange, inputError, setInputError,setFormData } = useForm(formDataInitialValue, Role.admin);
  const [loading, setLoading] = useState<boolean>(false)
  const { handleSubmit } = useFormSubmit(formData, setInputError)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const isValid = handleSubmit(e);

    try {
      if (isValid) {
        setLoading((prev) => !prev)
        const response = await dispatch(addMovie({ movieData: { ...formData, ...multiValueFormData }, movieType: MovieType.theater })).unwrap();
        if (response) {
          updateMovieData(response)
          closeButtonRef.current?.close()
          setFormData(formDataInitialValue);
          setMultiValueFormData(multiInitialValue);
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading((prev) => !prev)
    }

  }


  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Mandarin'];
  const formats = ['HD', '4K', '3D'];

  return (
    <form className="grid grid-cols-1 gap-4 p-3" onSubmit={onSubmit}>
      <div className="relative col-span-2">
        <label className=" label block mb-2" htmlFor="movie_name">Movie Name</label>
        <input
          className="relative input input-bordered w-full max-w-md"
          type="text"
          name="movie_name"
          value={formData.movie_name}
          onChange={handleChange}
          placeholder="Enter movie name"
        />
        {inputError.movie_name && <small className='text-red-600 capitalize absolute left-0 -bottom-6 font-mono '>{inputError.movie_name}</small>}
      </div>
      <div className="relative flex  gap-2 items-center">
        <div className="flex flex-col">
          <label className="label">Genres</label>
          <MultiSelectComponent
            field="genres"
            values={genres}
            handleAddValue={handleAddValue}
          />
        </div>
        <div className="relative flex flex-col">
          <label className="label">Language</label>
          <MultiSelectComponent
            field={'languages'}
            values={languages}
            handleAddValue={handleAddValue}
          />
        </div>
        <div className="relative flex flex-col">
          <label className="label">Select Format</label>
          <MultiSelectComponent
            field={'format'}
            values={formats}
            handleAddValue={handleAddValue}
          />
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
          name="release_date"
          value={formData.release_date}
          onChange={handleChange}
        />
        {inputError.release_date && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{inputError.release_date}</small>}

      </div>
      <div className="relative col-span-2">
        <label className="label block mb-2">Run time</label>
        <input type="number" onChange={handleChange} value={formData.run_time} name="run_time" className="input input-bordered w-full max-w-xs" placeholder="Movie running time (minutes)" />
        {inputError.run_time && <small className='text-red-600 capitalize absolute left-0 -bottom-5 font-mono '>{inputError.run_time}</small>}
      </div>
      <div className="text-center">
        <button type='submit' className="mt-3 btn bg-cyan-400 hover:bg-cyan-500 w-2/3" disabled={loading} >{!loading ? ('SUBMIT') : (<span className="loading loading-bars loading-md"></span>)}</button>
      </div>
    </form>
  );
};

export default AddMovieForm;
