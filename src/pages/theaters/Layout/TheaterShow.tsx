import { MouseEvent, useEffect, useState } from "react"
import { FaEdit } from "react-icons/fa"
import { GiCancel } from "react-icons/gi"
import { Action, IGetMovieShowResponse, IMovie, ResponseStatus, Role } from "../../../interface/Interface"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../redux/store"
import { getAllShows, } from "../../../redux/actions/theaterAction"
import { Loader } from "../../../component/Loader"
import { formatRunTime, getIST, getMovieSrc, } from "../../../utils/format"
import { IMovieShow } from "../../../interface/theater/IMovieShow"

import Toast2, { Toast } from "../../../component/Toast2"

import MovieShowForm from "../../../component/theaters/MovieShowForm"



const TheaterShow: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [shows, setShows] = useState<IGetMovieShowResponse[] | []>([])
  const [selectedShow, setSelectedShow] = useState<IMovieShow | null>(null)
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [confirmation, setConfirmation] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<Toast | null>(null)
  const dispatch = useDispatch<AppDispatch>();

  const closeModal = () => setModalVisible(false)
  const clearToast = () => setToastMessage(null);
  const closeUpdateModal = () => setSelectedShow(null)

  const updateSelected = (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault()
    // console.log(id)
    const selected = shows.find((show) => show._id === id);
    // console.log(selected)
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
  const setToast = (toast: Toast) => {
    console.log('calling')
    setToastMessage(
      {
        alert: toast.alert,
        message: toast.message
      }
    )
  }
  const setVisible = () => setModalVisible(true)

  const getShows = async () => {
    try {
      console.log('running')
      // setLoading(true);

      const response = await dispatch(getAllShows()).unwrap()

      setShows(response)

    } catch (error) {

    } finally {
      // setLoading(false)
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

      <div className="flex justify-end bg">
        <button
          onClick={setVisible}
          className="btn bg-sky-400 hover:bg-cyan-600"
        >
          Add Show
        </button>
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
            {
              shows.length > 0 &&
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
                    <span className="badge font-bold rounded-none ">{show.showTime}</span>
                  </td>
                  <td>
                    <span className="badge font-bold rounded-none ">{show.screen.screen_name}</span>
                  </td>
                  <td className="flex justify-center items-center gap-3">

                    <button onClick={(e) => updateSelected(e, show._id)} className="btn bg-transparent hover:bg-transparent  border-none hover: join-item text-black"><FaEdit /></button>
                    <button className="btn bg-transparent hover:bg-transparent border-none hover: join-item text-red-600"><GiCancel /></button>

                  </td>

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
    </>
  )
}

export default TheaterShow  