import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import React, { FormEvent, MouseEvent, useEffect, useRef, useState } from "react"
interface CheckoutModalPops {
  closeModal: () => void
}


const CheckoutModal: React.FC<CheckoutModalPops> = ({ closeModal }) => {

  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
  }

  const paymentModalRef = useRef<HTMLDialogElement>(null)

  const closeLayoutModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    paymentModalRef.current?.close()
    closeModal()
  }

  useEffect(() => {
    if (paymentModalRef.current) {
      paymentModalRef.current.showModal();
    }
  }, [])

  return (
    <>
      <dialog id="payment-modal" ref={paymentModalRef} className="modal">
        <div className="modal-box">
          <button onClick={closeLayoutModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" options={{ layout: 'tabs' }} />
            <button disabled={isLoading || !stripe || !elements} id="submit">
              <span id="button-text">
                {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
              </span>
            </button>
            {message && <div id="payment-message">{message}</div>}
          </form>
        </div>
      </dialog>
    </>
  )
}

export default CheckoutModal