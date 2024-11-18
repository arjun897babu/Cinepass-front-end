import React   from "react";
 
import { Link, Outlet, useLocation } from "react-router-dom";


export const UserProfile: React.FC = (): JSX.Element => {
  const location = useLocation();
 
 
  return (

    <>
      <div className="p-2">
        <div className="navbar bg-white gap-3">
          <Link to="/profile">
            <button
              className={`btn capitalize text-sm  ${location.pathname === "/profile" ? "bg-sky-300 hover:bg-sky-200" : "hover:bg-sky-200"}`}
            >
              Profile
            </button>
          </Link>
          <Link to="/profile/booking">
            <button className={`btn capitalize text-sm  ${location.pathname === "/profile/booking" ? "bg-sky-300 hover:bg-sky-200" : "hover:bg-sky-200"}`}
            >
              Your bookings
            </button>
          </Link>
        </div>
      </div>

     <Outlet />




    </>
  );
};
