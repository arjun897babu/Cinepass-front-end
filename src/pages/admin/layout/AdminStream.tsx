import React, { useEffect, useState } from "react"
import { ToastMessage } from "./AdminUsers"
import Toast2 from "../../../component/Toast2"
import ConfirmationModal from "../../../component/ConfirmationModal"
import { Action, IMovie, IStreamingMovieData, ResponseStatus, Role } from "../../../interface/Interface"
import AddButton from "../../../component/AddButton"
import { MovieModal } from "../../../component/admin/MovieFromModal"
import Pagination from "../../../component/Pagination"
import { Loader } from "../../../component/Loader"
import { MovieType } from "../../../component/admin/MovieForm"
import MovieTable from "../../../component/admin/MovieTable"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../redux/store"
import useErrorHandler from "../../../hooks/useErrorHandler"
import { getMovie } from "../../../redux/actions/adminAction"

const AdminStream: React.FC = () => {



  const dispatch = useDispatch<AppDispatch>()
  const [loading, setLoading] = useState<boolean>(false)
  const [actionLoading, setActionLoading] = useState<boolean>(false)

  const [data, setData] = useState<IStreamingMovieData[]>([])
  const setNewMovies = () => { } // for adding  new movies to the state

  //Toast message 
  const [toastMessage, setToastMessage] = useState<ToastMessage | null>(null)
  const clearToast = () => setToastMessage(null)
  const setToast = (alert: ResponseStatus, message: string) => setToastMessage({ alert, message })

  const handleApiError = useErrorHandler(Role.admin, setToastMessage)

  async function fetchStreamingMovies() {
    setLoading(true)
    try {
      const response = await dispatch(getMovie({ movieType: MovieType.stream })).unwrap()
      if (response.status === ResponseStatus.SUCCESS) {
        setData(response.data.movies as IStreamingMovieData[])
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  //api call for deleting movies
  async function deleteMovie() {
    setLoading(true)
    try {

    } catch (error) {

    } finally {
      setLoading(false)

    }
  }

  //Confirmation modal
  const [confirmation, setConfirmation] = useState<boolean>(false)
  const closeConfirmationModal = () => setConfirmation(false);

  // Add streaming movie form
  const [addMovie, setAddMovie] = useState(false)
  const showAddForm = () => {
    setAddMovie(true)
  }

  //Edit movie form
  const [editMovie, setEditMovie] = useState<IStreamingMovieData | null>(null)


  //close form modal
  const closeForm = () => {
    if (addMovie) {
      setAddMovie(false)
    } else {
      setEditMovie(null)
    }
  }

  //pagination
  const [maxPage, setMaxPage] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const handleChangePage = (newPage: number) => setCurrentPage(newPage)

  function updateMovieTable(action: Action  ) {
    switch (action) {
      case Action.ADD:
        if (currentPage !== 1) {
          setCurrentPage(1)
        } else {
          fetchStreamingMovies()
        }
        break;
      case Action.UPDATE:
        fetchStreamingMovies()
        break
      case Action.DELETE:
        fetchStreamingMovies()
        break
    }
  };

  const selectedMovie = (movieId: string, action: Action) => {
    if (action === Action.DELETE) {
      setConfirmation(true)
    } else if (action === Action.UPDATE) {
      const selectedMovie = data.find((item) => item._id === movieId)
      if (selectedMovie) {
        setEditMovie(selectedMovie)
      }
    }
  }

  useEffect(() => {
    fetchStreamingMovies()
  }, [currentPage])

  if (loading) return <div className="flex justify-center items-center"><Loader /></div>


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
        
      }
      {
        confirmation &&
        <ConfirmationModal
          btnType={ResponseStatus.ERROR}
          message={`Are you sure you want to  delete this movie? This action cannot be undone.`}
          isOpen={confirmation}
          onClose={closeConfirmationModal}
          onConfirm={deleteMovie}
        />
      }

      {
        addMovie &&
        <MovieModal  // add movie form modal
          updateMovieTable={updateMovieTable}
          closeModal={closeForm}
          action="add"
          id="addMovie"
          setToast={setToast}
          movieType={MovieType.stream}
        />
      }

      {
        editMovie &&
        <MovieModal  // update form modal

          updateMovieTable={updateMovieTable }
           closeModal={closeForm}
          setToast={setToast}
          action="update"
          id="updateMovie"
          selectedData={editMovie}
          movieType={MovieType.stream}
        />
      }

      <AddButton
        btnColor="bg-sky-400"
        btnText="Add Stream"
        cb={showAddForm}
      />

      {
        <MovieTable
          currentPage={currentPage}
          data={data}
          loading={actionLoading}
          movieType={MovieType.stream}
          selectedMovie={selectedMovie}
        />
      }



      {
        maxPage && data.length > 0 &&
        <div className="flex justify-center mt-3">
          <Pagination
            currentPage={currentPage}
            totalPages={maxPage}
            onPageChange={handleChangePage}
          />
        </div>
      }

    </>
  )
}

export default AdminStream