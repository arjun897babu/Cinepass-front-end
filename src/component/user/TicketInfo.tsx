import React, { memo } from "react";
import { IGetSingleShow, IPaymentSummaryLocationState, IStreamRentLocationState } from "../../interface/Interface"
import { convertTo12HourFormat, generateSeatingorder, getDate, getDayName, getMonthName } from "../../utils/format";
import { isITicketSummaryProps } from "../../utils/validator";
const TicketQRCode = React.lazy(()=>import('./QR-code'))



export interface ITicketInfoProps extends
  Pick<IGetSingleShow, 'movie' | 'theater'>,
  Pick<IPaymentSummaryLocationState['showDetails'], 'show' | 'screen'> {
  bookingDate: string | Date;
  selectedSeats: string[]
  bookingCode?: string
}

const TicketInfo: React.FC<ITicketInfoProps | IStreamRentLocationState> = (

  props

) => {
  const ticketData = isITicketSummaryProps(props);

  const seats = ticketData && props.selectedSeats
  const bookingCode = ticketData && props.bookingCode

  const bookingDate = ticketData
    ? props.bookingDate
    : props.bookingDate;

  return (
    <div className="ticket-summary  p-2 m-2 ">
      <div className="bg-base-100  rounded-md">
        <div className="hero-content gap-6 justify-start relative">
          {
            ticketData &&bookingCode&&seats&&
              <div className="absolute bottom-8 left-8 xs:top-8 xs:right-8 xs:bottom-auto xs:left-auto">
                <TicketQRCode bookingCode={bookingCode } seats={seats } />
              </div>
          }

          <div className="w-28 relative -top-12 xs:w-44 xs:static ">
            <img
              src={ticketData ?
                props.movie.movie_poster
                : props.streamingData.movie_poster}
              className=" h-full w-full object-contain  rounded-lg shadow-2xl"
            />
          </div>
          <div className="join mt-2 flex-col gap-2">
            <h1 className="text-2xl font-bold capitalize">{ticketData ? props.movie.movie_name : props.streamingData.movie_name}</h1>
            <div className="join text-md items-center gap-3 capitalize ">
              <span className="badge rounded-none ">{ticketData ? props.show.language : props.streamingData.languages[0]}</span>
              {
                ticketData ?
                  (<span className="badge rounded-none">{props.show.format}</span>) :
                  (<span className="badge rounded-none">{props.streamingData.genres[0]}</span>)
              }

            </div>
            {
              ticketData &&
              <>
                <h6 className="text-sm tracking-wider mt-3 ">{`${props.theater.theater_name}, ${props.theater.city} `}</h6>
                <div className="divider  divider-neutral text-xs tracking-wide"> {props.bookingCode && props.bookingCode}</div>
              </>
            }


            <div className={`sm:grid grid-cols-3 gap-2 justify-between items-center mt-3`}>
              <div className="col-span-2">
                <h2 className={`${ticketData ? 'font-extrabold tracking-wide sm:text-lg' : 'text-sm font-bold'} `}>
                  {ticketData ?
                    (`  ${getDayName(bookingDate)}, `
                      + `${getDate(bookingDate)} `
                      + `${getMonthName(bookingDate)}, `
                      + `${convertTo12HourFormat(`${props.show.showTime}`)}`) :
                    (
                      <div className="flex flex-col capitalize tracking-wider  ">
                        <p className="text-xs">Rented on {getDayName(bookingDate)} , {getDate(bookingDate)} , {getMonthName(bookingDate)}</p>
                        <p className="text-lg">plan   : {props.streamingData.streamingPlan.planName}</p>
                        <p className="text-gray-500 text-lg ">price: ₹{props.streamingData.streamingPlan.price}</p>
                      </div>)
                  }
                </h2>
                {ticketData && <h2 className="font-bold tracking-wide text-gray-400">
                  {
                    `${props.screen.screen_name} `
                    + `${generateSeatingorder(props.selectedSeats)}`
                  }
                </h2>}
              </div>
              <div className="btn cursor-default flex flex-col capitalize  ">
                {ticketData ?
                  (<>
                    <span>{props.selectedSeats.length}</span>
                    <span>TICKET</span>
                  </>) : (<>
                    <span>{props.streamingData.streamingPlan.validity} month</span>
                    <span>Validity</span>
                  </>)}
              </div  >
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(TicketInfo)