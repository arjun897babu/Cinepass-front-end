import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { AppDispatch, RootState } from "../../redux/store"
import { useEffect, useState } from "react"
import { ITicketSummaryLocationState, ResponseStatus, Role } from "../../interface/Interface";
import { calculateTotalAmount } from "../../utils/format";
import CheckoutModal from "../../component/user/CheckoutModal";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useErrorHandler from "../../hooks/useErrorHandler";
import { bookTickets } from "../../redux/actions/userAction";
import TicketInfo from "../../component/user/TicketInfo";


const { VITE_TEST_PUBLISHABLE_API_KEY } = import.meta.env
const PaymentSummary = () => {
  const stripePromise = loadStripe(VITE_TEST_PUBLISHABLE_API_KEY);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const handleApiError = useErrorHandler(Role.users);



  const { city, bookingInfo } = useSelector((state: RootState) => state.user)
  let data: ITicketSummaryLocationState | null = location?.state ?? bookingInfo

  useEffect(() => {

    if (!data && city) {
      navigate(`/home/${city}`, { replace: true });
    }

  }, [data]);


  const [checkoutModal, setCheckOutModal] = useState(false)
  const openCheckOutModal = async () => {

    try {
      setLoading(true)
      if (data && data.showDetails && data.showDetails.show._id) {
        const response = await dispatch(bookTickets(
          {
            showId: data.showDetails.show._id,
            showDetails: data.showDetails,
            bookingDate: data.bookingDate,
            selectedSeats: data.selectedSeats
          }
        ))
          .unwrap()

        if (response.status === ResponseStatus.SUCCESS) {
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

      {data && <div className="md:flex md:justify-between p-2">
        <TicketInfo
          bookingDate={data.bookingDate}
          selectedSeats={data.selectedSeats}
          movie={data.showDetails.movie}
          screen={data.showDetails.screen}
          show={data.showDetails.show}
          theater={data.showDetails.theater}
        />
        <div className="booking-summary bg-base-100 p-2 m-2 rounded-md">
          <h1 className="capitalize text-lg font-medium ">booking summary</h1>
          <div className="h-[300px]">

            <h3 className="font-semibold my-3">Ticket</h3>
            <div className="flex px-2 font-semibold tracking-wider items-center justify-between">
              <span className="text-xs text-gray-500"> {`${data.selectedSeats.length} x ${data?.showDetails.screen.screen_name} Ticket ${data?.showDetails.screen.chargePerSeat} each `}</span>
              <span>{`${data.selectedSeats.length * data?.showDetails.screen.chargePerSeat}`}</span>
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
            <span>₹{`${calculateTotalAmount(data.selectedSeats.length, data?.showDetails.screen.chargePerSeat, 20)}`}</span>
          </div>
          <div className="divider divider-neutral p-0 m-0"></div>
          <button onClick={openCheckOutModal} className="btn btn-wide bg-sky-400 hover:bg-sky-500">
            {!loading ? 'proceed to pay' : <div className="loading loading-xs"></div>}
          </button>
        </div>
      </div>}

      {data && checkoutModal && stripePromise && clientSecret && paymentIntentId &&

        <Elements
          options={
            {
              appearance:{ theme: 'stripe' },
              clientSecret
            }
          }
          stripe={stripePromise}>
          <CheckoutModal
            paymentIntentId={paymentIntentId}
            closeModal={closeCheckOutModal}
            theaterDetail={data?.showDetails.theater}
            amount={calculateTotalAmount(data.selectedSeats.length, data?.showDetails.screen.chargePerSeat, 20)}
          />
        </Elements>
      }
    </>
  )
}

export default PaymentSummary