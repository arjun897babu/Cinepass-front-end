import React, { MouseEvent, useEffect, useRef } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { ResponseStatus } from "../interface/Interface";

interface ConfirmationModalProps {
  isOpen: boolean; // based on this sate the modal will up . passed through the parent
  onClose: () => void; // this will close the modal by chaing the modalshowing state into false.
  onConfirm: () => void;//this is to perfom the submission. if clickin on confirm it will call the call
  message: string; // modal alert mesage
  btnType: ResponseStatus // style pf the button colcor based on the status of form
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, message, btnType }) => {
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
      <dialog id="confirmatin_modal" ref={modalRef} className="modal rounded-xs">
        <div className="modal-box max-w-sm">
          <h3 className="font-bold text-xl">Are you sure?</h3>
          <h4 className=" p-1 my-4 font-semibold text-sm">{message} ?</h4>
          <div className="modal-action">

            <button className="btn btn-active rounded-xs" onClick={modalClose}  >cancel</button>
            <button className={`btn ${btnType === ResponseStatus.ERROR ? 'btn-error' : 'btn-success'} rounded-xs`}
              onClick={confirmAction} >
               
              {btnType === ResponseStatus.ERROR  ? <MdBlock /> : <FaCheckCircle />}

              Confirm</button>

          </div>
        </div>
      </dialog >
    </>
  )
}
export default ConfirmationModal