import React, { MouseEvent, useEffect, useState } from "react"
import { FaEdit } from "react-icons/fa"
import { GiCancel } from "react-icons/gi"
import { MovieType } from "../../../component/admin/MovieForm"
import { Action, IMovie, ITheaterMovieData, ResponseStatus, Role } from "../../../interface/Interface"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../../redux/store"
import { getMovie, manageMovie } from "../../../redux/actions/adminAction"
import { formatRunTime, getIST, getMovieSrc, getSerialNumber } from "../../../utils/format"
import { Loader } from "../../../component/Loader"
import { ToastMessage } from "./AdminUsers"
import Toast2 from "../../../component/Toast2"
import { MovieModal } from "../../../component/admin/MovieFromModal"
import ConfirmationModal from "../../../component/ConfirmationModal"
import useErrorHandler from "../../../hooks/useErrorHandler"
import Pagination from "../../../component/Pagination"



const AdminMovie: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState(false)
  const [theaterMovies, setTheaterMovies] = useState<ITheaterMovieData[]>([]);
  const [maxPage, setMaxPage] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const handleChangePage = (newPage: number) => setCurrentPage(newPage)
  const [selectedMovie, setSelectedMovie] = useState<ITheaterMovieData | null>(null); // Modal shows selected movie's info for update
  // const setNewMovies = (movieData: IMovie) => {
  //   setTheaterMovies((prevMovies) => {
  //     const existingMovieIndex = prevMovies.findIndex(movie => movie._id === movieData._id);

  //     if (existingMovieIndex >= 0) {

  //       const updatedMovies = [...prevMovies];
  //       updatedMovies[existingMovieIndex] = movieData;
  //       return updatedMovies;
  //     } else {

  //       return [...prevMovies, movieData];
  //     }
  //   });

  // };

  function updateMovieTable(action: Action) {
    switch (action) {
      case Action.ADD:
        if (currentPage !== 1) {
          handleChangePage(1)
        } else {
          fetchMovieData()
        }
        break;
      case Action.UPDATE:
        fetchMovieData()
        break
      case Action.DELETE:
        fetchMovieData()
        break
    }
  };

  //close modal for update form
  const closeModalView = () => setSelectedMovie(null)


  const [addMovieModal, setAddMovieModal] = useState<boolean>(false) //for add movie form modal 
  //close modal for add form
  const closeAddMovieModal = () => setAddMovieModal(false)


  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null);
  const setToast = (alert: ResponseStatus, message: string) => setToastMessage({ alert, message })
  const clearToast = () => setToastMessage(null)
  const handleApiError = useErrorHandler(Role.admin, setToastMessage)

  const [confirmation, setConfirmation] = useState<boolean>(false)
  const closeConfirmationModal = () => setConfirmation(false);

  const [deleteMovieId, setDeleteMovieId] = useState<string | null>(null)
  const deleteButtonClicked = (e: MouseEvent<HTMLButtonElement>, _id: string | undefined) => {
    e.preventDefault()
    _id ?
      (setDeleteMovieId(_id), setConfirmation(true))
      : null;
  }

  const deleteMovie = async () => {
    if (deleteMovieId) {
      try {
        const response = await dispatch(manageMovie({ movieType: MovieType.theater, movieId: deleteMovieId })).unwrap()
        if (response.status === ResponseStatus.SUCCESS) {
          const { movie } = response.data;
          setToastMessage({ alert: response.status, message: response.message })
          updateMovieTable(Action.DELETE)
          // setTheaterMovies((prev) =>
          //   prev.map((item) =>
          //     item._id === movie._id
          //       ? { ...item, status: movie.status }
          //       : item

          //   )
          // );
        }
      } catch (error) {

      } finally {
        setDeleteMovieId(null)
        setConfirmation(false)
      }
    }
  }

  const fetchMovieData = async () => {
    try {
      setLoading(true)

      await Promise.resolve(setTimeout(() => { }, 30000))

      const response = await dispatch(getMovie({ movieType: MovieType.theater, pageNumber: currentPage })).unwrap();
      if (response) {
        setTheaterMovies(response.data.movies)
        setMaxPage(response.data.maxPage)
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }



  useEffect(() => {
    fetchMovieData()
  }, [currentPage])

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
        toastMessage &&
        <Toast2
          alert={toastMessage.alert}
          clearToast={clearToast}
          message={toastMessage.message}
        />
      }

      {
        addMovieModal &&
        <MovieModal  // add movie form modal
          updateMovieTable={updateMovieTable}
          closeModal={closeAddMovieModal}
          action="add"
          id="addMovie"
          setToast={setToast}
          movieType={MovieType.theater}
        />
      }

      {
        confirmation &&
        <ConfirmationModal
          btnType={ResponseStatus.ERROR}
          message="Are you sure you want to delete this movie?"
          isOpen={confirmation}
          onClose={closeConfirmationModal}
          onConfirm={deleteMovie}
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
                            {getSerialNumber(currentPage, index)}
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
                            <span className="badge font-bold rounded-none ">{getIST(movie.release_date.toString())}</span>
                          </td>
                          <td className="flex justify-center items-center gap-3">

                            <button onClick={showUpdateForm} className="btn bg-transparent hover:bg-transparent  border-none hover: join-item text-black" data-id={movie._id}><FaEdit /></button>
                            <button onClick={(e) => deleteButtonClicked(e, movie._id)} className="btn bg-transparent hover:bg-transparent border-none hover: join-item text-red-600"><GiCancel /></button>

                          </td>
                          {/* <th>
                            <button className="btn btn-ghost btn-xs">details</button>
                          </th> */}
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
          <MovieModal  // update form modal
            updateMovieTable={updateMovieTable}
            closeModal={closeModalView}
            setToast={setToast}
            action="update"
            id="updateMovie"
            movieType={MovieType.theater}
            selectedData={selectedMovie}
          />
        }

        {
          maxPage && theaterMovies.length > 0 &&
          <div className="flex justify-center mt-3">
            <Pagination
              currentPage={currentPage}
              totalPages={maxPage}
              onPageChange={handleChangePage}
            />
          </div>
        }

      </div >
    </>
  )
}

export default AdminMovie
