import { useDispatch } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { AppDispatch } from "../../redux/store"
import { useEffect, useState } from "react"
import { IGetSingleShow } from "../../interface/Interface";
import { calculateTotalAmount, convertTo12HourFormat, getDate, getDayName, getMonthName, toValidJSDate } from "../../utils/format";
import CheckoutModal from "../../component/user/CheckoutModal";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

interface ILocationState {
  showDetails: IGetSingleShow;
  showId: string;
  selectedSeats: string[];
  bookingDate: string;
}
const { VITE_TEST_PUBLISHABLE_API_KEY } = import.meta.env
const PaymentSummary = () => {
  const stripePromise = loadStripe(VITE_TEST_PUBLISHABLE_API_KEY);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()

  const { showDetails, showId, selectedSeats, bookingDate, } = location.state as ILocationState
  const navigate = useNavigate()

  const [checkoutModal, setCheckOutModal] = useState(false)
  const openCheckOutModal = () => setCheckOutModal(true)
  const closeCheckOutModal = () => setCheckOutModal(false)

  return (
    <>

      <div className="md:flex md:justify-between p-2">

        <div className="ticket-summary flex-1 m-2 ">
          <div className="bg-base-100  rounded-md">
            <div className="hero-content justify-start">
              <div className="w-48 h=w-48">
                <img
                  src={showDetails.movie.movie_poster}
                  className=" h-full w-full object-contain  rounded-lg shadow-2xl"
                />
              </div>
              <div className="join mt-2 flex-col gap-2">
                <h1 className="text-2xl font-bold">{showDetails.movie.movie_name}</h1>
                <div className="join text-md items-center gap-3  ">
                  <span className="text-gray-500 font-semibold ">{showDetails.show.language}</span>
                  <span className="badge rounded-none">{showDetails.show.format}</span>
                </div>
                <h6 className="text-sm tracking-wider mt-3 ">{`${showDetails.theater.theater_name}`}</h6>


                <div className="grid grid-cols-3 gap-3 justify-between items-center mt-3">
                  <div className="col-span-2">
                    <h2 className="font-extrabold tracking-wide text-lg">
                      {
                        `${getDayName(toValidJSDate(bookingDate))}, `
                        + `${getDate(toValidJSDate(bookingDate))} `
                        + `${getMonthName(toValidJSDate(bookingDate))}, `
                        + `${convertTo12HourFormat(showDetails.show.showTime as string)}`
                      }
                    </h2>
                    <h2 className="font-bold tracking-wide text-gray-400">
                      {
                        `${showDetails.screen.screen_name}, `
                        + `${selectedSeats.join(' ')}`
                      }
                    </h2>
                  </div>
                  <div className="btn btn-active cursor-none flex flex-col ">
                    <span>{selectedSeats.length}</span>
                    <span>TICKET</span>
                  </div  >
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="booking-summary bg-base-100 p-2 m-2 rounded-md">
          <h1 className="capitalize text-lg font-medium ">booking summary</h1>
          <div className="h-[300px]">

            <h3 className="font-semibold my-3">Ticket</h3>
            <div className="flex px-2 font-semibold tracking-wider items-center justify-between">
              <span className="text-xs text-gray-500"> {`${selectedSeats.length} x ${showDetails.screen.screen_name} Ticket ${showDetails.screen.chargePerSeat} each `}</span>
              <span>{`${selectedSeats.length * showDetails.screen.chargePerSeat}`}</span>
            </div>
            <h3 className="font-semibold my-3">Fees</h3>
            <div className="flex px-2 font-semibold tracking-wider justify-between">
              <span className="text-xs text-gray-500">Booking Charges</span>
              <span>20.00</span>
            </div>
          </div>
          <div className="divider divider-neutral p-0 m-0"></div>
          <div className="flex px-2 font-semibold tracking-wider justify-between">
            <span>Total</span>
            <span>₹{`${calculateTotalAmount(selectedSeats.length, showDetails.screen.chargePerSeat, 20)}`}</span>
          </div>
          <div className="divider divider-neutral p-0 m-0"></div>
          <button onClick={openCheckOutModal} className="btn btn-wide bg-sky-400 hover:bg-sky-500">
            proceed to pay
          </button>
        </div>
      </div>

      {checkoutModal && clientSecret &&

        <Elements options={{ appearance: { theme: 'stripe' } }} stripe={stripePromise}>
          <CheckoutModal
            closeModal={closeCheckOutModal}
          />
        </Elements>
      }
    </>
  )
}

export default PaymentSummary