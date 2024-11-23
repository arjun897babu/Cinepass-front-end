import React, { useEffect, useRef, useState } from "react"
import { FaArrowLeft } from "react-icons/fa"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import useErrorHandler from "../../hooks/useErrorHandler"
import { IGetSingleShow, PurchasedItem, ResponseStatus, Role } from "../../interface/Interface"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { getSingleShowDetails } from "../../redux/actions/userAction"
import screen_layout_icon from '/screen_icon.svg'
import { Loader } from "../../component/Loader"
import { convertTo12HourFormat, getDate, getDayName, getMonthName, getSeatName } from "../../utils/format"
import { ColumnNumbers, SeatRow } from "../../component/theaters/SeatLayoutModal"
import Toast2, { Toast } from "../../component/Toast2"

const ScreenLayout: React.FC = () => {
  const screeenLayoutRef = useRef<HTMLDivElement>(null)

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { city } = useSelector((state: RootState) => state.user)

  const location = useLocation()

  const [toastmessage, setToastMessage] = useState<Toast | null>(null)
  const [loading, setLoading] = useState(false);



  const [isOverFlowing, setIsOverFlowing] = useState(false)
  const [forceRender, setForceRender] = useState(0)
  useEffect(() => {
    function checkOverflow() {
       if (screeenLayoutRef.current) {
         const element = screeenLayoutRef.current;
        const isWide = element.scrollWidth > element.clientWidth;
        setIsOverFlowing(isWide);
      } 
    }

    if (!screeenLayoutRef.current) {
      setForceRender((prev) => prev + 1);
    } else {
      checkOverflow();
    }

  }, [forceRender])


  const setToast = (toast: Toast) => setToastMessage(
    {
      alert: toast.alert,
      message: toast.message
    }
  )

  const [showDetails, setShowDetails] = useState<IGetSingleShow | null>(null)
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  const { showId } = useParams()
  const handleApiError = useErrorHandler(Role.users)
  async function getSingleShow() {
    setLoading(true)
    try {
      if (city && showId) {
        const response = await dispatch(getSingleShowDetails(
          {
            city,
            showId,
            filter: {
              bookingDate: location.state.bookingDate
            }
          }
        )).unwrap()
        if (response.status === ResponseStatus.SUCCESS) {
          setShowDetails(response.data.shows)
        }
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (city && showId) {
      getSingleShow()
    }
  }, [showId])



  const handleSeatSelection = (rowIndex: number, colIndex: number) => {
    const maxSeat = 10
    const reservedSeats = showDetails?.show.reserved?.length ?? 0
    let seatsLeft = showDetails?.screen.seating_capacity! - reservedSeats

    const seatName = getSeatName(rowIndex, colIndex);
    setSelectedSeats((prevSelectedSeats) => {
      if (prevSelectedSeats.includes(seatName)) {
        seatsLeft++
        return prevSelectedSeats.filter((seat) => seat !== seatName);
      }
      if (prevSelectedSeats.length >= maxSeat) {
        setToast({
          alert: ResponseStatus.ERROR,
          message: 'Limit exceeded! Only 10 tickets allowed for a user'
        })
        return prevSelectedSeats
      }
      seatsLeft--
      return [...prevSelectedSeats, seatName];
    });
  }


  const bookSeat = async () => {
    if (selectedSeats?.length && showId && showDetails) {
      const { reserved, ...showWithoutReserved } = showDetails.show;
      const { layout, ...screenWithoutLayout } = showDetails.screen;

      const newShowDetails = {
        ...showDetails,
        show: showWithoutReserved,
        screen: screenWithoutLayout
      };

      navigate('/payment',
        {
          state: {
            selectedSeats,
            bookingDate: location.state.bookingDate,
            showDetails: newShowDetails,
            purchasedItem: PurchasedItem.TICKET
          }
        }
      )
    }
  }

  if (loading) return <Loader />

  if (!showDetails) return <div>no data found</div>

  return (
    <>
      {/* 
      {
        confirmation &&
        <ConfirmationModal
          btnType={ResponseStatus.SUCCESS}
          isOpen={confirmation}
          message={"If a show is canceled or breaks for unforeseen reasons, internet tickets will only be refunded online"}
          onClose={() => setConfirmation(false)}
          onConfirm={onBookingConfirm}
        />
      } */}
      {
        toastmessage &&
        <Toast2
          alert={toastmessage.alert}
          message={toastmessage.message}
          clearToast={() => setToastMessage(null)}
        />
      }
      <div className="bg-white h-screen flex flex-col ">
        {/* theater and show details */}
        <div className=" space-y-2 sm:flex p-2 items-center justify-between gap-3">
          <div className="join items-center gap-4 ">
            <FaArrowLeft size={20} onClick={() => (navigate(-1), setSelectedSeats([]))} className="cursor-pointer" />
            <div className="join join-vertical gap-3">
              <h2 className="join-item font-semibold capitalize  ">{showDetails.movie.movie_name}</h2>
              <h6 className="join-item text-xs capitalize">
                {`${showDetails.theater.theater_name}, ${city} | ${getMonthName(location.state.bookingDate)} ${getDayName(location.state.bookingDate)} ${getDate(location.state.bookingDate)}, ${convertTo12HourFormat(showDetails.show.showTime!)}`}
              </h6>
            </div>
          </div>
          <div className="join gap-3">
            <div className="border border-sky-300  rounded-md w-7 h-7" /><span className="">available</span>
            <div className="rounded-md w-7 h-7 bg-gray-400" /><span className="">booked</span>
            <div className="rounded-md w-7 h-7 bg-sky-400" /><span className="">selected</span>
          </div>
        </div>
        <div className="divider mt-0 pt-0"></div>

        {/* seat layout */}
        {<div
          ref={screeenLayoutRef}
          className="flex-grow overflow-y-auto">
          <div className={`flex  ${!isOverFlowing ? 'justify-center' : 'justify-start'} `} >
            <div className="p-3 min-w-max mt-8">
              {showDetails.screen.layout.map((row, rowIndex) => (
                <SeatRow
                  rowNumber={rowIndex + 1}
                  seats={row}
                  key={rowIndex}
                  role={Role.users}
                  handleSeatClick={(colIndex) => handleSeatSelection(rowIndex, colIndex)}
                  reserved={showDetails.show.reserved!}
                  selectedSeat={selectedSeats}
                />
              ))
              }
              <ColumnNumbers
                columnCount={showDetails.screen.column}
              />
            </div>
          </div>

        </div>}
        <div className="flex justify-center p-2">
          <img src={screen_layout_icon} alt="screen_icon" />
        </div>

        {/* ticket details */}
        {
          selectedSeats.length > 0 &&
          <div className="flex justify-evenly gap-3 p-2 border-y">
            <div className="join join-vertical  space-y-2 ">
              <span className="join-item font-bold font-sans">₹{showDetails.screen.chargePerSeat * selectedSeats.length}</span>
              <p className="join join-item gap-2">
                <span className="join-item capitalize">tickets</span>
                <span>:</span>
                <span className="join-item ">{selectedSeats.length}*{showDetails.screen.chargePerSeat}</span>
              </p>
            </div>
            <button className="button btn-wide bg-sky-300 rounded-md" onClick={bookSeat}>Book tickets</button>
          </div>
        }

      </div>

    </>
  )
}

export default ScreenLayout