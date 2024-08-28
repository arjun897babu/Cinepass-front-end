import { MouseEvent, useEffect, useState } from "react"
import { FaEdit } from "react-icons/fa"
import { GiCancel } from "react-icons/gi"
import { Action, IGetMovieShowResponse, ResponseStatus, Role } from "../../../interface/Interface"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../../redux/store"
import { deleteMovieShow, getAllShows, } from "../../../redux/actions/theaterAction"
import { Loader } from "../../../component/Loader"
import { convertTo12HourFormat, formatRunTime, getIST, getMovieSrc, } from "../../../utils/format"
import { IMovieShow } from "../../../interface/theater/IMovieShow"

import Toast2, { Toast } from "../../../component/Toast2"

import MovieShowForm from "../../../component/theaters/MovieShowForm"
import useErrorHandler from "../../../hooks/useErrorHandler"
import EmptyData from "../../../component/EmptyData"
import ConfirmationModal from "../../../component/ConfirmationModal"



const TheaterShow: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState<boolean>(false);

  const [shows, setShows] = useState<IGetMovieShowResponse[] | []>([])//state for showing theater show details

  const [confirmation, setConfirmation] = useState<boolean>(false)//confirmation alert

  const closeConfirmationModal = () => setConfirmation(false)

  //selecting show for updating shows
  const [selectedShow, setSelectedShow] = useState<IMovieShow | null>(null)
  const updateSelected = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault()
    const selected = shows.find((show) => show._id === id);
    
    selected ?
      setSelectedShow(
        {
          _id: selected._id,
          endTime: selected.endTime,
          showTime: selected.showTime,
          language: selected.language,
          format: selected.format,
          movieId: selected.movie._id ?? '',
          screenId: selected.screen._id ?? '',
          opening_date: selected.opening_date
        }
      ) : null
  }




  //for open and close - add show modal form
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const setVisible = () => setModalVisible(true)
  const closeModal = () => setModalVisible(false)

  const [toastMessage, setToastMessage] = useState<Toast | null>(null)//for toast message
  const clearToast = () => setToastMessage(null);

  const closeUpdateModal = () => setSelectedShow(null)


  const setToast = (toast: Toast) => {
    setToastMessage(
      {
        alert: toast.alert,
        message: toast.message
      }
    )
  }

  const handleFetchError = useErrorHandler(Role.theaters, setToast)

  const getShows = async () => {
    try {
      setLoading(true);
      const response = await dispatch(getAllShows()).unwrap()
      setShows(response)
    } catch (error) {
      handleFetchError(error)
    } finally {
      setLoading(false)
    }
  }
  const [deleteShowId, setDeleteShowId] = useState<string | null>(null)

  const deleteSelected = (e: MouseEvent<HTMLButtonElement>, showId: string) => {
    e.preventDefault();
    setConfirmation(true)
    setDeleteShowId(showId)
  }



  const onSubmit = () => {
    if (deleteShowId) {
      dispatch(deleteMovieShow(deleteShowId))
        .unwrap()
        .then((response) => {
          if (response.status === ResponseStatus.SUCCESS) {
            setDeleteShowId(null);
            setConfirmation(false)
            const updateShows = shows.filter((show) => show._id !== deleteShowId)
            setShows((prev) =>
              [...prev, ...updateShows]
            )
            setToastMessage({
              alert: response.status,
              message: response.message
            })
          }
        })
        .catch((error) => {
          handleFetchError(error)
        })
    }
  }

  useEffect(() => {

    const storedMessage = localStorage.getItem('toastMessage');
    if (storedMessage) {
      const parsedMessage = JSON.parse(storedMessage);
      setToastMessage(parsedMessage);
      localStorage.removeItem('toastMessage');
    }
    getShows()
  }, []);

  if (loading) return <Loader />
  // if(shows.length===0) return <div></div>
  return (
    <>

      {
        modalVisible &&
        <MovieShowForm
          action={Action.ADD}
          closeModal={closeModal}
          id="add"
          setToast={setToast}
        />
      }
      {
        toastMessage &&
        <Toast2
          alert={toastMessage.alert}
          message={toastMessage.message}
          clearToast={clearToast}
        />
      }

      {
        confirmation &&
        <ConfirmationModal
          btnType={ResponseStatus.ERROR}
          isOpen={confirmation}
          message='Are you sure want to delete this show'
          onClose={closeConfirmationModal}
          onConfirm={onSubmit}
        />
      }

      <div className="flex justify-end bg">
        <button
          onClick={setVisible}
          className="btn bg-sky-400 hover:bg-cyan-600"
        >
          Add Show
        </button>
      </div>
      {
        shows.length === 0 ?
          (
            <div className="flex justify-center items-center">
              <EmptyData />
            </div>
          )
          :
          (
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
                  {
                    shows.map((show, index) => {
                      return <tr key={show._id}>
                        <th>
                          {index + 1}
                        </th>
                        <td>
                          <div className="flex items-center gap-3   max-w-60  whitespace-nowrap overflow-hidden ">
                            <div className="avatar">
                              <div className="mask h-16 w-16">
                                <img
                                  src={getMovieSrc(show.movie.movie_poster as string)}
                                  alt={`${show.movie.movie_name}_poster`} />
                              </div>
                            </div>
                            <div>
                              <div className="max-w-60 font-semibold text-black capitalize  text-ellipsis  whitespace-nowrap overflow-hidden">{show.movie.movie_name} </div>
                              <div className="text-sm opacity-50">{formatRunTime(show.movie.run_time)}</div>
                              <div className="text-sm opacity-50">{getIST(show.movie.release_date as string)}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge font-bold rounded-none ">{convertTo12HourFormat(show.showTime)}</span>
                        </td>
                        <td>
                          <span className="badge font-bold rounded-none ">{show.screen.screen_name}</span>
                        </td>
                        {<td className="flex justify-center items-center gap-3">

                          {new Date(show.movie.release_date) > new Date() &&
                            <button onClick={(e) => updateSelected(e, show._id)} className="btn bg-transparent hover:bg-transparent  border-none hover: join-item text-black">
                              <FaEdit />
                            </button>}
                          <button onClick={(e) => deleteSelected(e, show._id)} className="btn bg-transparent hover:bg-transparent border-none hover: join-item text-red-600"><GiCancel /></button>

                        </td>}

                      </tr>
                    })
                  }
                </tbody>
                {/* foot */}
                <tfoot>

                </tfoot>
              </table>

              {selectedShow &&
                <MovieShowForm
                  action={Action.UPDATE}
                  id="update"
                  closeModal={closeUpdateModal}
                  setToast={setToast}
                  initialData={selectedShow}

                />
              }
            </div>
          )
      }

    </>
  )
}

export default TheaterShow  