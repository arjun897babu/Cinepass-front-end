import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { AppDispatch, RootState } from "../../redux/store"
import { useEffect, useState } from "react"
import { IPaymentSummaryLocationState, ResponseStatus, Role, IStreamRentLocationState } from "../../interface/Interface";
import { calculateTotalAmount } from "../../utils/format";
import CheckoutModal from "../../component/user/CheckoutModal";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import useErrorHandler from "../../hooks/useErrorHandler";
import { bookTickets, userPurchaseStream } from "../../redux/actions/userAction";
import TicketInfo from "../../component/user/TicketInfo";
import { isResponseError } from "../../utils/customError";
import { HttpStatusCode } from "axios";
import { ToastMessage } from "../admin/layout/AdminUsers";
import Toast2 from "../../component/Toast2";
import { isIPaymentSummaryLocationState, isIStreamRentLocationState } from "../../utils/validator";
import { userResetBookingInfo } from "../../redux/reducers/userReducer";


const { VITE_TEST_PUBLISHABLE_API_KEY } = import.meta.env
const PaymentSummary = () => {
  const stripePromise = loadStripe(VITE_TEST_PUBLISHABLE_API_KEY);
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const handleApiError = useErrorHandler(Role.users);



  const { city, bookingInfo, isAuthenticated } = useSelector((state: RootState) => state.user)
  let data: IPaymentSummaryLocationState | IStreamRentLocationState | null = location?.state ?? bookingInfo 
  
  useEffect(() => {
    if (!data && city) {
      navigate(`/home/${city}`, { replace: true });
    }

  }, [data]);

  useEffect(() => {
    return () => {
      if (isAuthenticated && bookingInfo) {
        dispatch(userResetBookingInfo())
      }
    }
  }, [])

  const [checkoutModal, setCheckOutModal] = useState(false)
  const openCheckOutModal = async () => {

    try {
      setLoading(true)

      let response;

      if (data && isIPaymentSummaryLocationState(data) && data.showDetails?.show._id) {
        response = await dispatch(bookTickets({
          showId: data.showDetails.show._id,
          showDetails: data.showDetails,
          bookingDate: data.bookingDate,
          selectedSeats: data.selectedSeats,
        })).unwrap();
      }
      else if (data && isIStreamRentLocationState(data)) {

        response = await dispatch(userPurchaseStream(data.streamingData.slug)).unwrap();
      }

      if (response && response.status === ResponseStatus.SUCCESS) {
        setClientSecret(response.data.clientSecret);
        setPaymentIntentId(response.data.paymentIntentId);
        setCheckOutModal(true);
      }


    } catch (error) {
      if (isResponseError(error)) {
        if (error.statusCode === HttpStatusCode.BadRequest) {
          setTimeout(() => {
            navigate(-2)
          }, 2000)
          setToast({ alert: ResponseStatus.ERROR, message: error.data.message })
        } else {
          handleApiError(error)
        }
      }
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

      {
        toast &&
        <Toast2
          alert={toast.alert}
          message={toast.message}
          clearToast={() => setToast(null)}
        />
      }

      {data && <div className="md:flex md:justify-between p-2">
        {isIPaymentSummaryLocationState(data) && <TicketInfo
          bookingDate={data.bookingDate}
          selectedSeats={data.selectedSeats}
          movie={data.showDetails.movie}
          screen={data.showDetails.screen}
          show={data.showDetails.show}
          theater={data.showDetails.theater}
        />}
        {isIStreamRentLocationState(data) && <TicketInfo
          bookingDate={data.bookingDate}
          streamingData={data.streamingData}
        />}
        <div className="booking-summary bg-base-100 p-2 m-2 rounded-md">
          <h1 className="capitalize text-lg font-medium ">booking summary</h1>
          <div className="h-[300px]">

            {isIPaymentSummaryLocationState(data) ?
              (<>
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
              </>) :
              (
                <>
                  <h3 className="font-semibold my-3">Plan</h3>
                  <div className="flex px-2 font-semibold tracking-wider items-center justify-between">
                    <span className="text-xs text-gray-500 capitalize"> {data.streamingData.streamingPlan.planName}</span>
                    <span>₹{data.streamingData.streamingPlan.price.toFixed(2)}</span>
                  </div>
                  {/* <h3 className="font-semibold my-3">discount</h3>
                  <div className="flex px-2 font-semibold tracking-wider justify-between">
                    <span className="text-xs text-gray-500">Booking Charges</span>
                    <span>20.00</span>
                  </div> */}
                </>
              )
            }
          </div>
          <div className="divider divider-neutral p-0 m-0"></div>
          <div className="flex px-2 font-semibold tracking-wider justify-between">
            <span>Total</span>
            {
              isIPaymentSummaryLocationState(data) ?
                (<span>₹{`${calculateTotalAmount(data.selectedSeats.length, data?.showDetails.screen.chargePerSeat, 20)}`}</span>) :
                (<span>₹{`${data.streamingData.streamingPlan.price}`}</span>)
            }
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
              appearance: { theme: 'stripe' },
              clientSecret
            }
          }
          stripe={stripePromise}>
          {isIPaymentSummaryLocationState(data) && <CheckoutModal
            paymentIntentId={paymentIntentId}
            closeModal={closeCheckOutModal}
            theaterDetail={data?.showDetails.theater}
            amount={calculateTotalAmount(data.selectedSeats.length, data?.showDetails.screen.chargePerSeat, 20)}
          />}
          {isIStreamRentLocationState(data) && <CheckoutModal
            paymentIntentId={paymentIntentId}
            closeModal={closeCheckOutModal}
            amount={data.streamingData.streamingPlan.price}
          />}
        </Elements>
      }
    </>
  )
}

export default PaymentSummary