import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import React, { FormEvent, MouseEvent, useEffect, useRef, useState } from "react"
import logo from '/favicon_io/android-chrome-192x192.png'
import { ITheaterOwnerEntity } from "../../interface/theater/ITheaterOwner"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../redux/store"
import { cancelUserPayment } from "../../redux/actions/userAction"
import { ResponseStatus } from "../../interface/Interface"
interface CheckoutModalPops {
  closeModal: () => void,
  theaterDetail: Partial<ITheaterOwnerEntity>,
  amount: number
  paymentIntentId: string
}


const CheckoutModal: React.FC<CheckoutModalPops> = ({ closeModal, theaterDetail, amount, paymentIntentId }) => {
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

      const { error } = await stripe.confirmPayment({
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
      paymentModalRef.current?.close()
      closeModal()
    }
  }

  

  useEffect(() => {
    if (paymentModalRef.current) {
      paymentModalRef.current.showModal();
      console.log('payment modal is opening');
    }
  }, [])

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
              <div className="text-sm opacity-50">United States</div>
            </div>
          </div>
          <button onClick={closeLayoutModal} className="btn btn-sm btn-circle btn-white absolute right-2 top-2">✕</button>
          <div className=" p-4">

            {stripe &&
              <form id="payment-form" onSubmit={handleSubmit}>
                <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
                {message && <div id="payment-message">{message}</div>}
                <button disabled={isLoading || !stripe || !elements} id="submit" className="w-full btn  mt-3 bg-sky-400 hover:bg-sky-500">
                  <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner"></div> : `Pay ₹ ${amount}`}
                  </span>
                </button>
              </form>}
          </div>
        </div>
      </dialog>

      {

      }
    </>
  )
}

export default CheckoutModal