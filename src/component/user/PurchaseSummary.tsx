import { memo, MouseEvent } from "react"
import { BookingStatus, IGetSingleShow, ITickets, PurchasedItem } from "../../interface/Interface"
import { IPayment } from "../../interface/user/IPayment"
import { convertTo12HourFormat, getDate, getDayName, getMonthName } from "../../utils/format";

interface IData {
  movieInfo: IGetSingleShow['movie'];
  paymentInfo: Pick<IPayment, 'status' | 'paymentIntentId'>;
  TicketInfo: Pick<ITickets, 'bookingStatus' | 'bookingDate'>;
  showInfo: IGetSingleShow['show']

}

interface IPurchaseSummary {
  purchasedItem: PurchasedItem,
  data: IData;
  setSelected: (paymentId: string) => void
};


const PurchaseSummary: React.FC<IPurchaseSummary> = ({ purchasedItem, data, setSelected }) => {
  console.log(data.showInfo.cancelationDeadline,purchasedItem)
  const viewSelected = (e: MouseEvent<HTMLButtonElement>, paymentIntentId: string) => {
    e.preventDefault();
    setSelected(paymentIntentId)
  }
  return (
    <>
      <div className=" bg-base-100 w-72 flex flex-col 
  sm:w-2/4  sm:w-26 rounded-none mb-2">
        <div className="relative card sm:flex-row   ">
          <div className=" flex flex-col sm:flex-row sm:w-full justify-between   items-center   gap-4 p-2 m-1">
            <div className="join join-vertical">
              <span className="card-title join-item  capitalize">{data.movieInfo.movie_name}</span>
              <span className="capitalize join-item ">
                {
                  `${getDayName(data.movieInfo.release_date)}, `
                  + `${getDate(data.movieInfo.release_date)} `
                  + `${getMonthName(data.movieInfo.release_date)}, `
                  + `${convertTo12HourFormat(data.showInfo.showTime)}`
                }
              </span>
            </div>
            <div className="avatar glass">
              <div className="w-30 sm:w-20 rounded">
                <img src={data.movieInfo.movie_poster}
                  alt={data.movieInfo.movie_name} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between   p-2">
          <span className={`${data.TicketInfo.bookingStatus === BookingStatus.BOOKED ? "text-green-600" : "text-red-600"}`}>{`Tickets ${data.TicketInfo.bookingStatus}`}</span>
          <div className="card-actions  justify-end">
            <button onClick={(e) => viewSelected(e, data.paymentInfo.paymentIntentId)} className="btn bg-sky-400 hover:bg-sky-500 btn-sm rounded-sm">View Detail</button>
          </div>
        </div>
      </div>

    </>
  )
}

export default memo(PurchaseSummary)