import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { getDate, getDayName, getIST, getMonthName, toValidJSDate } from "../utils/format"
import { useLocation, useNavigate } from "react-router-dom";


type ShowFilterProps = {
  maxAllocatedDate: number,
  bookingDate: Date
}


const ShowFilter: React.FC<ShowFilterProps> = ({ maxAllocatedDate, bookingDate }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search);

  const startingDate = useMemo(() => {
    return new Date() <= new Date(bookingDate) ? new Date(bookingDate) : new Date();
  }, [bookingDate]);

  const scrollContainerRef = useRef<(HTMLDivElement | null) >( null) ;
  const dayRefs = useRef<(HTMLDivElement | null)[]>(Array.from({ length: maxAllocatedDate }, () => null));

  const [filterDate, setFilterDate] = useState(startingDate)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const bookingDateParam = searchParams.get("bookingDate");

    if (bookingDateParam) {
      const validDate = toValidJSDate(bookingDateParam);
      setFilterDate(validDate);
    }
  }, [location.search]);

  const changeBookingDate = useCallback((date: Date) => {
    searchParams.set('bookingDate', getIST(date.toString()));
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  }, [navigate, location.pathname, searchParams]);
 

  const dayFilter = useMemo(() => Array.from({ length: maxAllocatedDate }, (_, day) => {
    const newDate = new Date(startingDate)
    newDate.setDate(newDate.getDate() + day);
    return (
      <div
        key={newDate.toString()}
        data-date={newDate.toISOString()}
        onClick={() => changeBookingDate(newDate)}
        ref={(el) => (dayRefs.current[day] = el)}
        className=
        {
          `join cursor-pointer join-vertical items-center
        ${newDate.getDate() === filterDate.getDate() ?
            "bg-sky-400  text-white" :
            'bg-base-100   text-black'} p-2 `
        }
      >
        <span className="text-xs uppercase">{getDayName(newDate)}</span>
        <span className="font-semibold">{getDate(newDate)}</span>
      </div>
    );
  }), [startingDate, filterDate, maxAllocatedDate]);

 

  return (
    <div>
      <div className="m-2" >
        <div className="join items-center p-1 gap-2">
          {/* Display the month */}
          <span className="p-2 tracking-wide uppercase text-sm font-mono badge-neutral font-light rounded-sm -rotate-90  ">
            {getMonthName(startingDate)}
          </span>
          <div ref={scrollContainerRef} className="flex gap-2 overflow-x-auto w-40 no-scrollbar ">
            {dayFilter}
          </div>

        </div>

      </div>
    </div>
  );
};

export default memo(ShowFilter)