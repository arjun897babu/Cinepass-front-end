import React, { MouseEvent, useEffect, useRef, useState } from "react"
import { BookingStatus, IUserTicketData, MovieStatus, Role } from "../../interface/Interface"
import TicketInfo from "./TicketInfo"
import { checkMovieStatus } from "../../utils/validator"
import { getMovieTextStatus } from "../../utils/format"
import PaymentInfo from "./PaymentInfo"

const PurchaseDetailModal: React.FC<{ role: Role, data: IUserTicketData, closeModal: () => void }> = ({ role, data, closeModal }) => {

  const modalRef = useRef<HTMLDialogElement>(null)

  const closePurchaseModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (modalRef.current) {
      modalRef.current.close()
      closeModal()
    }
  }
  const [status, setStatus] = useState(MovieStatus.UPCOMING);

  useEffect(() => {
    const movieStatus = checkMovieStatus(data.showInfo.showTime, data.showInfo.endTime, data.movieInfo.release_date as string);
    setStatus(movieStatus);
  }, [data.showInfo.showTime, data.showInfo.endTime, data.movieInfo.release_date]);


  useEffect(() => {


    if (data && modalRef.current) {
      modalRef.current.showModal()
    }

  }, [data])


  return (
    <>
      <dialog id="purchase-detail-modal" className="modal modal-middle " ref={modalRef}>
        <div className="modal-box p-0 bg-base-200 rounded-md max-w-xl">
          <div
            className={` p-6  capitalize text-white text-lg font-medium  tracking-wider
               ${role === Role.users ?
                (data.TicketInfo.bookingStatus === BookingStatus.CANCELED ?
                  "bg-red-500"
                  : status === MovieStatus.COMPLETED ?
                    "bg-green-500"
                    : status === MovieStatus.RUNNING ?
                      "bg-yellow-500"
                      : "bg-sky-500")
                : (data.TicketInfo.bookingStatus === BookingStatus.CANCELED ?
                  'bg-red-500'
                  : 'bg-green-500'
                )
              }`
            }
          >

            {
              role === Role.users ?
                (data.TicketInfo.bookingStatus === BookingStatus.CANCELED
                  ? ""
                  : getMovieTextStatus(status))
                :
                (data.TicketInfo.bookingStatus === BookingStatus.CANCELED
                  ? "Canceled"
                  : "Booked")
            }


          </div>
          <button
            onClick={closePurchaseModal}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white text-lg"
          >
            ✕
          </button>
          <div className="p-2 red flex flex-col items-center justify-center">
            {/* ticket information */}
            <TicketInfo
              bookingDate={data.TicketInfo.bookingDate.toString()}
              movie={data.movieInfo}
              screen={data.screenInfo}
              selectedSeats={data.TicketInfo.seats}
              show={data.showInfo}
              theater={data.theaterInfo}
              bookingCode={data.TicketInfo.bookingCode}
            />
            <div className="divider divider-neutral opacity-25 "> </div>
            {/* payment charges information */}
            <div className="">
              <PaymentInfo
                screenInfo={data.screenInfo}
                ticketInfo={data.TicketInfo}
                paymentInfo={data.paymentInfo}
              />
            </div>
          </div>
        </div>


      </dialog>
    </>
  )
}

export default PurchaseDetailModal