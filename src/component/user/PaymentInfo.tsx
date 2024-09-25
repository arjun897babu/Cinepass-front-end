import React, { memo } from "react"
import { FaCheck } from "react-icons/fa6"
import { GiTicket } from "react-icons/gi"
import { BookingStatus, IUserTicketData } from "../../interface/Interface"
import { FcCancel } from "react-icons/fc"
interface IPaymentInfoProps {
  ticketInfo: IUserTicketData['TicketInfo']
  screenInfo: IUserTicketData['screenInfo']
  paymentInfo: IUserTicketData['paymentInfo']
}
const PaymentInfo: React.FC<IPaymentInfoProps> = ({ screenInfo, ticketInfo, paymentInfo }) => {
 
  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow-md w-[300px]">

        <h2 className="font-bold tracking-wide mb-4">Payment Summary</h2>
        {/* Total Amount Paid */}
        <div className="flex text-sm font-semibold tracking-wide justify-between items-center mb-2">
          <h6>Total Amount Paid</h6>
          <h6>₹{paymentInfo.totalAmount}</h6>
        </div>

        {/* Tickets Section */}
        <div className="mb-4">
          <p className="flex items-center font-semibold  tracking-wide mb-3">
            Tickets <span className="ml-2 text-green-600">
              {
                ticketInfo.bookingStatus === BookingStatus.CANCELED
                  ? <FcCancel size={15} />
                  : <FaCheck size={15} />
              }
            </span>
          </p>
          <div className="flex justify-between items-center text-gray-400 text-xs">
            <p className="flex items-center ">
              <span className="mr-2 flex">

                <GiTicket />


              </span>
              {ticketInfo.seats.length} Tickets @ {screenInfo.chargePerSeat} each
            </p>
            <p className=" ">₹{screenInfo.chargePerSeat * ticketInfo.seats.length}</p>
          </div>
        </div>

        {/* Fees Section */}
        <div className="flex justify-between items-center tracking-wide text-sm">
          <p className=" ">Fees</p>
          <p className="tracking-tight text-xs">₹{paymentInfo.serviceCharge}</p>
        </div>
      </div >

    </>
  )
}

export default memo(PaymentInfo)