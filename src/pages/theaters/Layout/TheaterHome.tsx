import { DashBoardCard } from "../../../component/DashBoardCard"

const TheaterHome = () => {
  return (
    <>
      <div className="sm:w-full sm:p-5 sm:flex sm:items-center sm:justify-between gap-3">
        <DashBoardCard header=" Bookings" data="2200" />
        <DashBoardCard header=" Movies" data="23" />
        <DashBoardCard header=" Total Profit" data="₹233340" />
      </div>
    </>
  )
};

export default TheaterHome