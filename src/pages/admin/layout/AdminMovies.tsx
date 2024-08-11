import React, { ChangeEvent, FormEvent, MouseEvent, RefObject, useEffect, useRef, useState } from "react"
import { FaEdit } from "react-icons/fa"
import { GiCancel } from "react-icons/gi"
import AddMovieForm, { MovieType } from "../../../component/admin/AddMovieForm"
import { IMovie, ResponseStatus, Role } from "../../../interface/Interface"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../redux/store"
import { getMovie } from "../../../redux/actions/adminAction"
import { formatRunTime, getIST, getMovieSrc } from "../../../utils/format"
import { Loader } from "../../../component/Loader"
import { ToastMessage } from "./AdminUsers"
import Toast2 from "../../../component/Toast2"
import Toast from "../../../component/Toast"

interface AddMovieModalProp {
  id: string
  action: string
  updateMovieData: (movieData: IMovie) => void
  closeModal: () => void
  selectedData?: IMovie,
}

//modal for add a new Theater movie in admin side
const AddMovieModal: React.FC<AddMovieModalProp> = (
  {
    id,
    action,
    updateMovieData,
    closeModal,
    selectedData
  }) => {

  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null)

  const setToast = (alert: ResponseStatus, message: string) => {
    setToastMessage({ alert, message })
  }

  const modalRef = useRef<HTMLDialogElement>(null);
  const clearToast = () => {
    setToastMessage(null)
  }
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  }, []);

  const closeAddForm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    modalRef.current?.close()
    closeModal()
  }
  return (

    <>

      {/* {
        toastMessage &&
        <Toast2
          alert={toastMessage.alert}
          clearToast={clearToast}
          message={toastMessage.message}
        />
      } */}
     


      <dialog ref={modalRef} id={`${id}_Form`} className="modal ">
        <div className="modal-box w-11/12 max-w-3xl  ">

          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={closeAddForm}>✕</button>
          <h3 className="text-2xl font-bold mb-4 text-center">{action} Movie</h3>
          <AddMovieForm
            movieType={MovieType.theater}
            updateMovieData={updateMovieData}
            closeButtonRef={modalRef}
            selectedData={selectedData}
            setToast={setToast}
            closeModal={closeModal}
          />
        </div>
      </dialog>
    </>
  )
}

const AdminMovie: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [theaterMovies, setTheaterMovies] = useState<IMovie[] | []>([]);
  const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null); // Modal shows selected movie's info for update

  const [addMovieModal, setAddMovieModal] = useState<boolean>(false) //for add movie form modal 


  //call back for updating the theater movie list
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

  //close modal for update form
  const closeModalView = () => {
    setSelectedMovie(null)
  }

  //close modal for add form
  const closeAddMovieModal = () => {
    setAddMovieModal(false)
  }

  const fetchMovieData = async () => {
    try {
      setLoading(true)
      const response = await dispatch(getMovie(MovieType.theater)).unwrap();
      if (response) {
        setTheaterMovies(response)
      }
    } catch (error) {
      console.log(error) //handle the error
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchMovieData()
  }, [])

  const showUpdateForm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const _id = e.currentTarget.getAttribute('data-id');
    if (_id) {
      const [movie] = theaterMovies.filter((movie) => movie._id === _id)
      setSelectedMovie(movie)
    }
  }

  const showAddForm = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setAddMovieModal(true)
  }


  return (
    <>

      {
        addMovieModal &&
        <AddMovieModal  // add movie form modal
          updateMovieData={setNewMovies}
          closeModal={closeAddMovieModal}
          action="add"
          id="addMovie"
        />
      }

      <div className="flex justify-end">
        <button onClick={showAddForm} className="btn mb-4 bg-cyan-400 hover:bg-cyan-500" type="button">Add movie</button>
      </div>
      <div className="overflow-x-auto overflow-y-hidden">

        {
          loading ?
            (<Loader />) // loading icon
            :
            (
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
                                    src={getMovieSrc(movie.movie_poster) ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTITe0RQgdI1j52yUOAOx_pSjmzoZa8n_bcWA&s'}
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

                            <button onClick={showUpdateForm} className="btn bg-transparent hover:bg-transparent  border-none hover: join-item text-black" data-id={movie._id}><FaEdit /></button>
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
            )}

        {
          selectedMovie &&
          <AddMovieModal  // update form modal
            updateMovieData={setNewMovies}
            closeModal={closeModalView}
            action="update"
            id="updateMovie"
            selectedData={selectedMovie}
          />
        }

      </div >
    </>
  )
}

export default AdminMovie
