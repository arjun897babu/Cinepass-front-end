import React, { MouseEvent, useEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { IPlan, ResponseStatus } from "../interface/Interface";

interface ConfirmationModalProps {
  isOpen: boolean; // based on this sate the modal will up . passed through the parent
  onClose: () => void; // this will close the modal by changing the modal showing state into false.
  onConfirm: () => void;//this is to perform the submission. if clicking on confirm it will call the call
  message: string; // modal alert message
  btnType: ResponseStatus // style pf the button color based on the status of form
  payment?: boolean
  plan?: IPlan
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message, btnType, payment, plan }) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const modalClose = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onClose()
  }
  useEffect(() => {
    isOpen ?
      modalRef.current?.showModal()
      : modalRef.current?.close()

  }, [isOpen]);

  const confirmAction = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    modalRef.current?.close()
    onConfirm()
  }

  return (

    <>
      <dialog id="confirmation_modal" ref={modalRef} className="modal rounded-xs">
        <div className="modal-box max-w-sm">
          {/* <h3 className="font-bold text-xl">Are you sure?</h3> */}
          {
            payment ?
              (
                <>
                  <h1 className="font-bold tracking-wider text-lg">Rent</h1>
                  <hr />
                  <p className="my-2 font-normal text-sm">You can Rent this movie for  {plan?.validity} months with {plan?.planName} plan </p>
                  <div className="flex gap-3 text-sm">
                    <span className="font-bold">Price</span>
                    <span className="font-bold" >₹{plan?.price}</span>
                  </div>
                  <p className="my-4 font-semibold text-xs leading-tight ">
                    {message}
                  </p>

                </>
              ) :
              (<h4 className=" p-1 my-4 font-semibold text-sm">{message} ?</h4>)
          }

          <div className="modal-action">

            <button className="btn btn-active rounded-xs" onClick={modalClose}  >cancel</button>
            <button className={`btn ${btnType === ResponseStatus.ERROR ? 'btn-error' : 'btn-success'} rounded-xs`}
              onClick={confirmAction} >
              {btnType === ResponseStatus.ERROR ? <MdBlock /> : <FaCheckCircle />}
              Confirm</button>

          </div>
        </div>
      </dialog >
    </>
  )
}
export default ConfirmationModal