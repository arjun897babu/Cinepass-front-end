import { } from 'react-icons'
import React, { memo, MouseEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '/cinepass logo.png'
import { GiHamburgerMenu } from "react-icons/gi"
import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import { getAllMovies, getTheatersByCity, getUserProfile, logoutUser } from '../../redux/actions/userAction'
import { IMovie, ResponseStatus, Role } from '../../interface/Interface'
import useErrorHandler from '../../hooks/useErrorHandler'
import { isResponseError } from '../../utils/customError'
import { ITheaterOwnerEntity } from '../../interface/theater/ITheaterOwner'
import MoviesTheatersDropdown from './MoviesTheatersDropdown'
import { HttpStatusCode } from 'axios'



const UserNavBar: React.FC = (): JSX.Element => {
  const { city } = useSelector((state: RootState) => state.user)
  const [toggle, setToggle] = useState(true); // State for hamburger menu toggle
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector((state: RootState) => state.user)
  const handleApiError = useErrorHandler(Role.users)
  // const [loading, setLoading] = useState<boolean>(false)
  const [movies, setMovies] = useState<IMovie[] | []>([])
  const [theaters, setTheaters] = useState<Partial<ITheaterOwnerEntity>[] | []>([])

  const navigate = useNavigate()
  // Handler for toggle
  const handleToggle = () => {
    setToggle((prevToggle) => !prevToggle);
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
  };

  const fetchProfile = async () => {
    try {

      await dispatch(getUserProfile()).unwrap()

    } catch (error) {
      handleApiError(error)
    }
  }

  //for fetching theater movies 
  const fetchData = async () => {
    try {
      // setLoading(true);
      if (city) {
        const [moviesResponse, theatersResponse] = await Promise.all([
          dispatch(getAllMovies({ city })).unwrap(),
          dispatch(getTheatersByCity(city)).unwrap(),
        ]);
        if (moviesResponse) {
          setMovies(moviesResponse);
        }
        if (theatersResponse.status === ResponseStatus.SUCCESS) {
          setTheaters(theatersResponse.data.theater);
        }
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      
      if (isResponseError(error)) {
        if (error.statusCode === HttpStatusCode.Forbidden) {
          navigate('/login', { replace: true, state: { blocked: true } });
        } 
      }
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (!city) {
      navigate('/')
      return
    }
    fetchData()
  }, [city]);

  useEffect(() => {
    if (user.isAuthenticated) {
      fetchProfile()
    }
  }, [user.isAuthenticated])

  useEffect(() => {

  }, [user.profile])


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
        <Link to={`/home/${user.city}`}>
          <div className="gap-3 flex items-center  ml-12 md:ml-0 ">
            <img src={logo} alt="Cine pass Logo" className='object-cover max-w-20 max-h-20' />
            <span className='dancing-script text-2xl text-center align-middle '>Cinepass</span>
          </div>
        </Link>

        <div className="nav_menu hidden  md:gap-2 lg:gap-5 md:flex   ">
          <Link className='hover:bg-blue-100 uppercase p-3 font-semibold  ' to={`/home/${user.city}`}>Home <span></span></Link>
          <MoviesTheatersDropdown
            city={`${city}`}
            item='movies'
            moviesOrTheater={movies}
          />
          <MoviesTheatersDropdown
            city={`${city}`}
            item='theaters'
            moviesOrTheater={theaters}
          />
          <Link className='hover:bg-blue-100 uppercase p-3 font-semibold ' to={'/streams'}>streams</Link>
        </div>

        <div className="auth-section hidden pl-6 text-base font-bold leading-6 text-center">

          {!user.isAuthenticated ?
            <Link to={'/login'}>
              <div className="px-6 py-3 text-white  rounded-md bg-black max-md:px-5">
                Log In
              </div>
            </Link>
            :

            (
              <div className="dropdown dropdown-hover  dropdown-bottom dropdown-end ">
                <div tabIndex={0} className="cursor-pointer">
                  <div className='avatar '>
                    <div className='w-16 rounded-full '>
                      <img
                        src={user.profile?.profile_picture ?? 'https://t4.ftcdn.net/jpg/03/40/12/49/240_F_340124934_bz3pQTLrdFpH92ekknuaTHy8JuXgG7fi.jpg'}
                        alt="user avatar"
                      />
                    </div>
                  </div>
                </div>

                <div tabIndex={0} className="dropdown-content menu   bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <h3 className="text-black capitalize px-4 py-2">{user.profile?.name ?? 'Arjun'}</h3>
                  <hr className="my-1" />
                  <ul className="list-none">
                    <Link to={'/profile'}>
                      <li className="dropdownItem ">
                        <span className="text-black cursor-pointer">Profile</span>
                      </li>
                    </Link>
                    <li className="dropdownItem  ">
                      <span className="text-black cursor-pointer" onClick={logoutHandle}>Logout</span>
                    </li>
                  </ul>
                </div>
              </div>
            )
          }

        </div>
      </nav >
    </>
  )
}

export default memo(UserNavBar)

