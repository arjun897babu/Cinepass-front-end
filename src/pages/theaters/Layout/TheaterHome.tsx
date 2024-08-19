import { useEffect } from "react";
import { DashBoardCard } from "../../../component/DashBoardCard"
import { useLoggedOwner } from "../../../hooks/useLoggedUser";
import { Role } from "../../../interface/Interface";
import { useNavigate } from "react-router-dom";

const TheaterHome = () => {

const {isAuthenticated} = useLoggedOwner(Role.theaters)
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