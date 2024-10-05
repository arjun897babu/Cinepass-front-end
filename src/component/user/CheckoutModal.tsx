import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import React, { FormEvent, MouseEvent, useEffect, useRef, useState } from "react"
import logo from '/favicon_io/android-chrome-192x192.png'
import { ITheaterOwnerEntity } from "../../interface/theater/ITheaterOwner"
import { useNavigate, } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../redux/store"
import { cancelUserPayment } from "../../redux/actions/userAction"
import { ResponseStatus } from "../../interface/Interface"
import { formatTime } from "../../utils/format"
import { useTimer } from "../../hooks/useTimer"
interface CheckoutModalPops {
  closeModal: () => void,
  theaterDetail: Partial<ITheaterOwnerEntity>,
  amount: number
  paymentIntentId: string
}


const CheckoutModal: React.FC<CheckoutModalPops> = ({ closeModal, theaterDetail, amount, paymentIntentId }) => {
  const { startTimer, timeRemaining, isActive } = useTimer(60)
  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);
  const dispatch = useDispatch<AppDispatch>()
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!stripe || !elements) {
        return;
      }
      setIsLoading(true);

      const { } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:3000/paymentsuccess",

        },
      });


    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  }



  const paymentModalRef = useRef<HTMLDialogElement>(null)

  const closeLayoutModal = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const response = await dispatch(cancelUserPayment({ paymentIntentId })).unwrap()
    if (response.status === ResponseStatus.SUCCESS) {
      navigate(-1)
    }
  }



  const handlePaymentElementReady = () => {
    setIsPaymentElementReady(true);
  }

  //useEffect for handling the timer
  useEffect(() => {
    if (isPaymentElementReady) {
      startTimer()

    }
    if (paymentModalRef.current) {
      paymentModalRef.current.showModal();
    }
    if (timeRemaining === 0) {
      navigate(-1)
    }
  }, [isPaymentElementReady, startTimer, timeRemaining])


  return (
    <>
      <dialog id="payment-modal" ref={paymentModalRef} className="modal">

        <div className="modal-box p-0 items-center">
          <div className="flex items-center gap-3 mb-2 bg-sky-400 p-2">
            <div className="avatar">
              <div className="mask  h-20 w-20">
                <img
                  src={logo}
                  alt="cinepass logo" />
              </div>
            </div>
            <div>
              <div className="font-bold">{theaterDetail.theater_name}</div>
              <div className="text-sm opacity-50">{theaterDetail.city}</div>
            </div>
          </div>
          <button disabled={isLoading || !isPaymentElementReady} onClick={closeLayoutModal} className="btn btn-sm btn-circle btn-white absolute right-2 top-2">✕</button>
          <div className=" p-4">

            {stripe &&
              <>
                {isPaymentElementReady && timeRemaining && isActive && <div className="flex justify-center">
                  <div className="m-2 text-red-600 text-lg font-bold text-center">
                    Time remaining: {formatTime(timeRemaining)}
                  </div>
                </div>}

                <form id="payment-form" onSubmit={handleSubmit}>
                  <PaymentElement
                    id="payment-element"
                    options={{ layout: 'tabs' }}
                    onReady={handlePaymentElementReady}
                  />
                  {message && <div id="payment-message">{message}</div>}
                  <button disabled={isLoading || !stripe || !elements || !isActive} id="submit" className="w-full btn  mt-3 bg-sky-400 hover:bg-sky-500">
                    <span id="button-text">
                      {isLoading ? <div className="loading" ></div> : `Pay ₹ ${amount}`}
                    </span>
                  </button>
                </form>
              </>
            }
          </div>
        </div>
      </dialog>

      {

      }
    </>
  )
}

export default CheckoutModal