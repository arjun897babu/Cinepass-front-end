import { useEffect } from "react";
import { DashBoardCard } from "../../../component/DashBoardCard"
 
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import  type { Rootstate } from "../../../redux/store";

const TheaterHome = () => {

const {isAuthenticated} = useSelector((state:RootState)=>state.theaters)
const navigate = useNavigate()
  useEffect(() => {

    if (isAuthenticated) {
      navigate('/theaters/home', { replace: true })
      return
    }

  }, [isAuthenticated])
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