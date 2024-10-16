import React from 'react'
import logo from '/cinepass logo.png'
import { FaHome } from "react-icons/fa";
import { GiTheater } from "react-icons/gi";
import { BiCameraMovie, } from "react-icons/bi";
import { CiStreamOn } from "react-icons/ci";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { FiUsers } from "react-icons/fi";
import { RiLogoutCircleLine, RiMovieLine } from "react-icons/ri";
import { logoutAdmin } from '../../redux/actions/adminAction';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
// import { TheaterDetails } from './layout/AdminTheaters';

const menu = [
  {
    title: 'Home',
    logo: FaHome,
    link: '/admin/home'
  },
  {
    title: 'Users',
    logo: FiUsers,
    link: '/admin/users'
  },
  {
    title: 'Theater',
    logo: GiTheater,
    link: '/admin/theaters'
  },
  // {
  //   title: 'Tickets',
  //   logo: IoTicketSharp,
  //   link: '/admin/tickets'
  // },
  {
    title: 'Stream',
    logo: RiMovieLine,
    link: '/admin/stream'
  },
  {
    title: 'Movies',
    logo: BiCameraMovie,
    link: '/admin/movie'
  },
  {
    title: 'Stream Plan',
    logo: CiStreamOn,
    link: '/admin/stream-plan'
  }
];
 

export const AdminParent: React.FC = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await dispatch(logoutAdmin());
      navigate('/admin/login')
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <>
      <div className="flex h-screen ">
        {/* sidebar */}
        <div className="p-5 pt-8 gap-5 w-70 relative hidden sm:block ">
          {/* website logo */}
          <div className="gap-3 flex items-center ml-12 md:ml-0">
            <img src={logo} alt="Cine pass Logo" className='object-cover max-w-20 max-h-20' />
            <span className='dancing-script text-2xl text-center align-middle'>Cinepass</span>
          </div>
          {/* list */}
          <div className='h-96 border-2 border-cyan-400 mt-12 relative'>
            <ul className=''>
              {menu.map((value, index) => (
                <Link to={value.link} key={`${value.title + index}`}>
                  <li className={`${location.pathname === value.link ? 'text-white bg-cyan-400' : 'text-gray-950 bg-white'} text-sm flex items-center gap-x-4 cursor-pointer p-2`}>
                    <value.logo className='text-2xl block float-left' />
                    <span className='text-base font-medium flex-1'>{value.title}</span>
                  </li>
                </Link>
              ))}
            </ul>
            <button onClick={handleLogOut} className='bg-cyan-400 absolute bottom-0 p-3 font-medium flex gap-5 justify-center items-center  w-full '>
              <RiLogoutCircleLine />
              Logout
            </button>

          </div>

        </div>
        {/* sidebar */}
        <div className="right-section  flex-col w-full h-full">
           
          <div className=" h-28">
            {/* welcome note */}
            <div className=" p-5 pt-8">
              <h1 className='font-extrabold font-serif text-2xl'> Hello Arjun</h1>
              <h2 className='font-semi font-serif text-lg'>Welcome Back !!</h2>
            </div>
            {/* welcome note */}
          </div>
          <div className="content p-5">
            <Outlet />
          </div>
        </div>

      </div>
    </>
  );
};
