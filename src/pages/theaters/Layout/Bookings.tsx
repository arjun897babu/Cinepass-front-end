import { MouseEvent, useEffect, useState } from "react"
import { ITheaterTicketData, ResponseStatus, Role } from "../../../interface/Interface"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { getTicketBookings } from "../../../redux/actions/theaterAction";
import { isResponseError } from "../../../utils/customError";
import { HttpStatusCode } from "axios";
import useErrorHandler from "../../../hooks/useErrorHandler";
import EmptyData from "../../../component/EmptyData";
import { getIST, getSerialNumber } from "../../../utils/format";
import { Loader } from "../../../component/Loader";
import PurchaseDetailModal from "../../../component/user/PurchaseDetailModal";
import Pagination from "../../../component/Pagination";
 
const Bookings = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [ticketData, setTicketData] = useState<ITheaterTicketData[] | null>(null);
  const [selected, setSelected] = useState<ITheaterTicketData | null>(null)
  const [maxPage, setMaxPage] = useState<number>(1)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const handleChangePage = (newPage: number) => setCurrentPage(newPage)
  const closeModal = () => setSelected(null)
  const [loading, setLoading] = useState(false)
  const handleApiError = useErrorHandler(Role.theaters)

  async function fetchTickets() {
    setLoading(true)
    try {
      const response = await dispatch(getTicketBookings({ pageNumber: currentPage })).unwrap()
      if (response.status === ResponseStatus.SUCCESS) {
        setTicketData(response.data.data)
        setMaxPage(response.data.maxPage)
      }
    } catch (error) {
      if (isResponseError(error)) {
        if (error.statusCode === HttpStatusCode.NotFound) {
          setTicketData(null)
        } else {
          handleApiError(error)
        }
      }
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchTickets()
  }, [currentPage])
  if (loading) return <Loader />

  if (!ticketData) return <div className="flex justify-center items-center"><EmptyData />  </div>
  const showDetails = (e: MouseEvent, id: string) => {
    e.preventDefault()
    const selected = ticketData.find((item) => item.TicketInfo._id === id)
    if (selected) {
      setSelected(selected)
    }
  }
  return (
    <>
      <div className="overflow-x-auto overflow-y-hidden">
        <table className="table">

          <thead>
            <tr className="capitalize text-black text-center ">
              <th >Sl.No</th>
              <th>show time</th>
              <th>screen</th>
              <th>booking date</th>
              <th>Movie</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              ticketData.map((item, index) => (
                <>

                  <tr key={item.TicketInfo._id}>
                    <td>{getSerialNumber(currentPage, index,2 )}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="avatar">
                          <div className="mask  h-12 w-12">
                            <img
                              src={item.userInfo.profile_picture}
                              alt={`${item.userInfo.name} profile picture`} />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{item.userInfo.name}</div>

                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-sky-400 rounded-sm badge-sm">{item.screenInfo.screen_name}</span>
                    </td>
                    <td ><span className="badge bg-sky-400 rounded-sm badge-sm">{getIST(item.TicketInfo.bookingDate.toString())}</span></td>
                    <td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar">
                            <div className="mask  h-12 w-12">
                              <img
                                src={item.movieInfo.movie_poster}
                                alt={`${item.movieInfo.movie_name} movie poster`} />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold">{item.movieInfo.movie_name}</div>
                            <div className="font-bold">{getIST(item.movieInfo.release_date.toString())}</div>

                          </div>
                        </div>
                      </td>
                    </td>
                    <th>
                      <button onClick={(e) => showDetails(e, item.TicketInfo._id)} className="btn bg-sky-400 rounded-sm hover:bg-sky-500 btn-xs">details</button>
                    </th>
                  </tr>
                </>
              ))
            }

          </tbody>
          {/* foot */}
          <tfoot>

          </tfoot>
        </table>
        {
          selected &&
          <PurchaseDetailModal
            role={Role.theaters}
            closeModal={closeModal}
            data={selected}
          />
        }

        {
          maxPage &&
          <div className="flex justify-center mt-3">
            <Pagination
              currentPage={currentPage}
              totalPages={maxPage}
              onPageChange={handleChangePage}
            />
          </div>
        }

      </div>
    </>
  )
}

export default Bookings