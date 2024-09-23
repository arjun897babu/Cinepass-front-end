import React, { MouseEvent, useEffect, useRef, useState } from "react"
import { IPayment } from "../../interface/user/IPayment"

const PurchaseDetailModal: React.FC<{ data?: IPayment, closeModal: () => void }> = ({ data }) => {
  console.log(data)

  const modalRef = useRef<HTMLDialogElement>(null)
  const closePurchaseModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (modalRef.current) {
      modalRef.current.close()
    }
  }
  useEffect(() => {


    if (data && modalRef.current) {
      modalRef.current.showModal()
    }

  }, [data])
  return (
    <>
      <dialog id="my_modal_1" className="modal" ref={modalRef}>
        <div className="modal-box ">
          <button onClick={closePurchaseModal} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>

        </div>
        <div className="p-2 flex flex-col justify-center">

        </div>
        <div>

        </div>
      </dialog>
    </>
  )
}

export default PurchaseDetailModal