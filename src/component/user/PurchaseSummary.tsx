import { memo, MouseEvent, useState } from "react"
import { PurchasedItem } from "../../interface/Interface"
import { IPayment } from "../../interface/user/IPayment"


interface IPurchaseSummary {
  purchasedItem: PurchasedItem,
  // data: IPayment;
  setSelected: (paymentId: string) => void

};


const PurchaseSummary: React.FC<IPurchaseSummary> = ({ purchasedItem, setSelected }) => {

  const viewSelected = (e: MouseEvent<HTMLButtonElement>, paymentId: string) => {
    e.preventDefault();
    setSelected(paymentId)
  }
  return (
    <>
      <div className=" bg-base-100 w-72 flex flex-col 
  sm:w-2/4  sm:w-26 rounded-none ">
        <div className="relative card sm:flex-row   ">
          <div className=" flex flex-col sm:flex-row sm:w-full justify-between   items-center   gap-4 p-2 m-1">
            <div className="join join-vertical">
              <span className="card-title join-item  capitalize">movie name</span>
              <span className="capitalize join-item ">sat,jun 22,9.00PM</span>
            </div>
            <div className="avatar glass">
              <div className="w-30 sm:w-20 rounded">
                <img src="https://res.cloudinary.com/dqakjy0hk/image/upload/v1725882872/admin/d6htvuenkupg4umzaddh.jpg"
                  alt="movie-name" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between   p-2">
          <span className="text-green-600">Ticket booked</span>
          <div className="card-actions  justify-end">
            <button onClick={(e) => viewSelected(e, '')} className="btn bg-sky-400 hover:bg-sky-500 btn-sm rounded-sm">View Detail</button>
          </div>
        </div>
      </div>

    </>
  )
}

export default memo(PurchaseSummary)