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
          <Link to="/booking">
            <button className={`btn capitalize text-sm  ${location.pathname === "/booking" ? "bg-sky-300 hover:bg-sky-200" : "hover:bg-sky-200"}`}
            >
              Your bookings
            </button>
          </Link>
          <Link to="/stream">
            <button
              className={`btn capitalize text-sm  ${location.pathname === "/stream" ? "bg-sky-300 hover:bg-sky-200" : "hover:bg-sky-200"}`}
            >
              Stream
            </button>
          </Link>
        </div>
      </div>

     <Outlet />




    </>
  );
};
