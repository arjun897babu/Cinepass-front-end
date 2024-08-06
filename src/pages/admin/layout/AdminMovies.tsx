import React, { ChangeEvent, FormEvent, MouseEvent, RefObject, useEffect, useRef, useState } from "react"
import { FaEdit } from "react-icons/fa"
import { GiCancel } from "react-icons/gi"
import AddMovieForm, { MovieType } from "../../../component/admin/AddMovieForm"
import { IMovie, Role } from "../../../interface/Interface"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../redux/store"
import { getMovie } from "../../../redux/actions/adminAction"
import { formatRunTime, getIST } from "../../../utils/format"

interface AddMovieModalProp {
  updateMovieData: (movieData: IMovie) => void
}

//modal for add a new Theater movie in admin side
const AddMovieModal: React.FC<AddMovieModalProp> = ({ updateMovieData }) => {

  const openAddMovieForm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const modal = document.getElementById('addMovieForm') as HTMLDialogElement
    if (modal) {
      modal.showModal()
    }
  }
  const closeButton = useRef<HTMLDialogElement>(null);
  const closeAddForm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const modal = document.getElementById('addMovieForm') as HTMLDialogElement
    if (modal) {
      modal.close()
    }

  }

  return (

    <>
      <div className="flex justify-end">
        <button onClick={openAddMovieForm} className="btn mb-4 bg-cyan-400 hover:bg-cyan-500" type="button">Add movie</button>
      </div>
      <dialog ref={closeButton} id="addMovieForm" className="modal ">
        <div className="modal-box w-11/12 max-w-5xl  ">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeAddForm}>✕</button>
          <h3 className="text-2xl font-bold mb-4 text-center">Add Movie</h3>
          <AddMovieForm movieType={MovieType.theater} updateMovieData={updateMovieData} closeButtonRef={closeButton} />
        </div>
      </dialog>

    </>
  )
}

const AdminMovie: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [theaterMovies, setTheaterMovies] = useState<IMovie[] | []>([]);
  const dispatch = useDispatch<AppDispatch>()

  const setNewMovies = (movieData: IMovie) => {

    setTheaterMovies((prevMovies) => {

      const existingMovieIndex = prevMovies.findIndex(movie => movie._id === movieData._id);

      if (existingMovieIndex >= 0) {

        const updatedMovies = [...prevMovies];
        updatedMovies[existingMovieIndex] = movieData;
        return updatedMovies;
      } else {

        return [...prevMovies, movieData];
      }
    });
  };

  const fetchMovieData = async () => {
    try {
      setLoading((prev) => !prev)
      const response = await dispatch(getMovie(MovieType.theater)).unwrap();
      if (response) {
        setTheaterMovies(response)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading((prev) => !prev)
    }
  }


  useEffect(() => {
    fetchMovieData()
  }, [])

  const showUpdateForm = (e: MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault()
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <>
      <AddMovieModal updateMovieData={setNewMovies} />
      <div className="overflow-x-auto overflow-y-hidden">

        <table className="table ">
          {/* head */}
          <thead className=" ">
            <tr>
              <th>
              </th>
              <th className="font-bold text-black">Name</th>
              <th className="font-bold text-black">Release Date</th>
              <th className="font-bold text-black text-center">Action</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="  ">
            {
              theaterMovies.length > 0 &&
              theaterMovies.map((movie, index) => {
                return (
                  <tr key={`${movie._id ?? index}`}>
                    <th>
                      {index + 1}
                    </th>
                    <td>
                      <div className="flex items-center gap-3   max-w-60  whitespace-nowrap overflow-hidden ">
                        <div className="avatar">
                          <div className="mask h-16 w-16">
                            <img
                              src="https://img.daisyui.com/images/profile/demo/2@94.webp"
                              alt={movie.movie_name + ' poster'} />
                          </div>
                        </div>
                        <div>
                          <div className="max-w-60 font-semibold text-black capitalize  text-ellipsis  whitespace-nowrap overflow-hidden"> {movie.movie_name} </div>
                          <div className="text-sm opacity-50">{formatRunTime(movie.run_time)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge font-bold rounded-none ">{getIST(movie.release_date as string)}</span>
                    </td>
                    <td className="flex justify-center items-center gap-3">

                      <button onClick={showUpdateForm} className="btn bg-transparent hover:bg-transparent  border-none hover: join-item text-black"><FaEdit /></button>
                      <button className="btn bg-transparent hover:bg-transparent border-none hover: join-item text-red-600"><GiCancel /></button>

                    </td>
                    <th>
                      <button className="btn btn-ghost btn-xs">details</button>
                    </th>
                  </tr>

                )
              })
            }

          </tbody>
          {/* foot */}
          <tfoot>

          </tfoot>
        </table>

      </div >
    </>
  )
}

export default AdminMovie
