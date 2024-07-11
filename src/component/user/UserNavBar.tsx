import { } from 'react-icons'
import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '/cinepass logo.png'
import { GiHamburgerMenu } from "react-icons/gi"
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../redux/store'
import { logoutUser } from '../../redux/actions/userAction'


const UserNavBar: React.FC = (): JSX.Element => {
  const { user } = useSelector((state: RootState) => state.user);
  let menuRef = useRef<HTMLDivElement>(null)
  const [toggle, setToggle] = useState(true);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  useEffect(() => {
    
    let handler = (e: globalThis.MouseEvent): void => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    };

    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler)
    }

  }, [])

  const logoutHandle = async (e: MouseEvent) => {
    e.preventDefault();
    const result = await dispatch(logoutUser());
    console.log('logout result : ',result);
    navigate('/login')
  }

  return (
    <>
      <nav className='relative p-4 flex justify-between items-center bg-white'>
        <button className='space-y-2 md:hidden absolute left-4 top-8 z-10 ' onClick={() => setToggle((prevToggle) => !prevToggle)}  >
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
        <Link to={'/'}>
          <div className="gap-3 flex items-center  ml-12 md:ml-0 " >
            <img src={logo} alt="Cine pass Logo" className='object-cover max-w-20 max-h-20' />
            <span className='dancing-script text-2xl text-center align-middle '>Cinepass</span>
          </div>
        </Link>

        <div className="nav_menu hidden  md:gap-2 lg:gap-5 md:flex   ">
          <Link className='uppercase p-3 font-semibold  ' to={'/'}>Home <span></span></Link>
          <Link className='uppercase p-3 font-semibold ' to={'/movies'}>movies</Link>
          <Link className='uppercase p-3 font-semibold ' to={'/cinemas'}>cinemas</Link>
          <Link className='uppercase p-3 font-semibold ' to={'/streams'}>streams</Link>
        </div>

        <div className="auth-section hidden pl-6 text-base font-bold leading-6 text-center">

          {!user ?
            <Link to={'/login'}>
              <div className="px-6 py-3 text-white  rounded-md bg-black max-md:px-5">
                Sign Up
              </div>
            </Link>
            :

            (<div ref={menuRef} className="relative">
              <div onClick={() => setOpen(!open)} className="cursor-pointer">
                <img
                  className="w-12 h-12 mx-auto rounded-full aspect-square cursor-pointer"
                  src={user?.profile_picture ?? 'https://t4.ftcdn.net/jpg/03/40/12/49/240_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg'}
                  alt="user avatar"

                />
              </div>
              <div className={`dropdown-menu ${open ? 'active' : 'inactive'} bg-white rounded-md shadow-lg py-2 mt-2 w-48 absolute right-0`}>
                <h3 className="text-black px-4 py-2">{user?.name ?? 'Arjun'}</h3>
                <hr className="my-1" />
                <ul className='list-none'>
                  <Link to={'/profile'}>
                    <li className='dropdownItem px-4 py-2 hover:bg-gray-200'>
                      <span className='text-black cursor-pointer'>Profile</span>
                    </li>
                  </Link>
                  <li className='dropdownItem px-4 py-2 hover:bg-gray-200'>
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

