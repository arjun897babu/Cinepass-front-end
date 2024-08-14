import { } from 'react-icons'
import React, { MouseEvent, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '/cinepass logo.png'
import { GiHamburgerMenu } from "react-icons/gi"
import { RxCross1 } from "react-icons/rx";
import { useDispatch } from 'react-redux'
import { AppDispatch } from '../../redux/store'
import { logoutUser } from '../../redux/actions/userAction'
import { useLoggedOwner } from '../../hooks/useLoggedUser'
import { Role } from '../../interface/Interface'


const UserNavBar: React.FC = (): JSX.Element => {

  let menuRef = useRef<HTMLDivElement>(null)
  const [toggle, setToggle] = useState(true); // State for hamburger menu toggle
  const [open, setOpen] = useState(false); // State for dropdown menu toggle
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate();
  const { loggedOwner, isAuthenticated, city } = useLoggedOwner(Role.users);// state for logged in user

  if (!city) {
    navigate('/')
  }

  // Handler for toggle
  const handleToggle = () => {
    setToggle((prevToggle) => !prevToggle);
  }
  // Handler for open
  const handleOpen = () => {
    setOpen((prevOpen) => !prevOpen);
  }
  // Handle logout
  const logoutHandle = async (e: MouseEvent) => {
    try {
      e.preventDefault();
      await dispatch(logoutUser());
      navigate('/login')
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <>
      <nav className='relative p-4 flex justify-between items-center bg-white'>
        <button className='space-y-2 md:hidden absolute left-4 top-8 z-10 ' onClick={handleToggle}  >
          {
            (toggle) ?
              <GiHamburgerMenu
                size={25}
                className={`transition ease-in-out duration-500 text-black  `}
              />
              :
              <RxCross1
                size={25}
                className={`transition ease-in-out duration-500 text-black `}
              />
          }
        </button>
        <Link  to={`/home/${city}`}>
          <div className="gap-3 flex items-center  ml-12 md:ml-0 ">
            <img src={logo} alt="Cine pass Logo" className='object-cover max-w-20 max-h-20' />
            <span className='dancing-script text-2xl text-center align-middle '>Cinepass</span>
          </div>
        </Link>

        <div className="nav_menu hidden  md:gap-2 lg:gap-5 md:flex   ">
          <Link className='hover:bg-blue-100 uppercase p-3 font-semibold  '  to={`/home/${city}`}>Home <span></span></Link>
          <Link className='hover:bg-blue-100 uppercase p-3 font-semibold ' to={'/movies'}>movies</Link>
          <Link className='hover:bg-blue-100 uppercase p-3 font-semibold ' to={'/cinemas'}>cinemas</Link>
          <Link className='hover:bg-blue-100 uppercase p-3 font-semibold ' to={'/streams'}>streams</Link>
        </div>

        <div className="auth-section hidden pl-6 text-base font-bold leading-6 text-center">

          {!isAuthenticated ?
            <Link to={'/login'}>
              <div className="px-6 py-3 text-white  rounded-md bg-black max-md:px-5">
                Log In
              </div>
            </Link>
            :

            (
              <div ref={menuRef} className="relative">
                <div onClick={handleOpen} className="cursor-pointer">
                  <img
                    className="w-12 h-12 mx-auto rounded-full aspect-square cursor-pointer"
                    src={loggedOwner?.profile_picture ?? 'https://t4.ftcdn.net/jpg/03/40/12/49/240_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg'}
                    alt="user avatar"

                  />
                </div>
                <div className={`dropdown-menu ${open ? 'active' : 'inactive'}  rounded-md shadow-lg py-2 mt-2 w-48 absolute right-0 z-20`}>
                  <h3 className="text-black capitalize px-4 py-2">{loggedOwner?.name ?? 'Arjun'}</h3>
                  <hr className="my-1" />
                  <ul className='list-none'>
                    <Link to={'/profile'}>
                      <li className='dropdownItem px-4 py-2 hover:bg-blue-100'>
                        <span className='text-black cursor-pointer'>Profile</span>
                      </li>
                    </Link>
                    <li className='dropdownItem px-4 py-2 hover:bg-blue-100'>
                      <span className='text-black cursor-pointer' onClick={logoutHandle}>Logout</span>
                    </li>
                  </ul>
                </div>
              </div>
            )
          }


        </div>

        {/* <div className="fixed inset-0 bg-red-300">

        </div> */}


      </nav >
    </>
  )
}

export default UserNavBar

