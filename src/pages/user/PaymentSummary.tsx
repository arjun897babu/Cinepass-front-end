import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { AppDispatch, RootState } from "../../redux/store"
import { useEffect, useState } from "react"
import { IGetSingleShow, ResponseStatus, Role } from "../../interface/Interface";
import { calculateTotalAmount } from "../../utils/format";
import CheckoutModal from "../../component/user/CheckoutModal";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useErrorHandler from "../../hooks/useErrorHandler";
import { bookTickets } from "../../redux/actions/userAction";
import TicketInfo from "../../component/user/TicketInfo";

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
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const dispatch = useDispatch<AppDispatch>()
  const { city } = useSelector((state: RootState) => state.user)

  const navigate = useNavigate()
  useEffect(() => {
    if (!location.state) {
      navigate(`/home/${city}`, { replace: true })
      return
    }
  }, [location.state])
  const { showDetails, showId, selectedSeats, bookingDate, } = location.state as ILocationState
  const handleApiError = useErrorHandler(Role.users);

  const [checkoutModal, setCheckOutModal] = useState(false)
  const openCheckOutModal = async () => {
    try {
      setLoading(true)
      if (showDetails && showDetails.show._id) {
        const response = await dispatch(bookTickets({ showId: showDetails.show._id, payload: { bookingDate, reservedSeats: selectedSeats } })).unwrap()
        if (response.status === ResponseStatus.SUCCESS) {
          console.log(response.data)
          setClientSecret(response.data.clientSecret)
          setPaymentIntentId(response.data.paymentIntentId)
          setCheckOutModal(true)
        }
      }
    } catch (error) {
      handleApiError(error)
    } finally {
      setLoading(false)
    }
  }
  const closeCheckOutModal = () => {

    setCheckOutModal(false)
    navigate(-2)
  }

  return (
    <>

      <div className="md:flex md:justify-between p-2">
        <TicketInfo
          bookingDate={bookingDate}
          selectedSeats={selectedSeats}
          movie={showDetails.movie}
          screen={showDetails.screen}
          show={showDetails.show}
          theater={showDetails.theater}


        />
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
            {!loading ? 'proceed to pay' : <div className="loading loading-xs"></div>}
          </button>
        </div>
      </div>

      {checkoutModal && stripePromise && clientSecret && paymentIntentId &&

        <Elements options={{ appearance: { theme: 'stripe' }, clientSecret }} stripe={stripePromise}>
          <CheckoutModal
            paymentIntentId={paymentIntentId}
            closeModal={closeCheckOutModal}
            theaterDetail={showDetails.theater}
            amount={calculateTotalAmount(selectedSeats.length, showDetails.screen.chargePerSeat, 20)}
          />
        </Elements>
      }
    </>
  )
}

export default PaymentSummary