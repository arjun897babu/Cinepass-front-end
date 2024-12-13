import React, { memo, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '/cinepass logo.png'
import { GiHamburgerMenu } from "react-icons/gi"
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import type { AppDispatch, RootState } from '../../redux/store'
import { getAllMovies, getUserProfile, logoutUser } from '../../redux/actions/userAction'
import { IMovie, Role } from '../../interface/Interface'
import useErrorHandler from '../../hooks/useErrorHandler'
import { isResponseError } from '../../utils/customError'
import MoviesTheatersDropdown from './MoviesTheatersDropdown'
import { HttpStatusCode } from 'axios'
import { ProfileMenu } from './ProfileMenu'
import { Loader } from '../Loader'


const UserNavBar: React.FC = (): JSX.Element => {
  const { city, isAuthenticated, profile } = useSelector((state: RootState) => ({
    city: state.user.city,
    isAuthenticated: state.user.isAuthenticated,
    profile: state.user.profile
  }), shallowEqual);

  const dispatch = useDispatch<AppDispatch>()
  const handleApiError = useErrorHandler(Role.users)
  // const [loading, setLoading] = useState<boolean>(false)
  const [movies, setMovies] = useState<IMovie[] | []>([])
  const [loading, setLoading] = useState<boolean>(true); // Loading state


  const navigate = useNavigate()

  // Handle logout
  const logoutHandle = async () => {
    try {
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
      if (city) {
        const moviesResponse = await dispatch(getAllMovies({ city: city })).unwrap()
        if (moviesResponse) {
          setMovies(moviesResponse);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!city) {
      navigate('/');
    } else {
      fetchData();
    }
  }, [city]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const memoizedMovies = useMemo(() => movies, [movies]);

  if (loading) return <Loader />

  return (
    <>
      <nav className='relative p-4 flex justify-between items-center bg-white'>
        {/* mobile hamburger icon */}
        <button className='space-y-2 md:hidden absolute left-4 top-8 z-10 '>
          <div className="drawer">
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />

            <label htmlFor="my-drawer" className=" bg-transparent drawer-button z-20">
              <GiHamburgerMenu
                size={25}
                className={`transition ease-in-out duration-500 text-black  `}
              />
            </label>
            <div className="drawer-side">
              <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
              <ul className="menu bg-base-300 text-base-content min-h-full w-80 p-4">
                <div className="mt-14">
                  <li>
                    <Link className='uppercase p-3 font-semibold  ' to={`/home/${city}`}>Home <span></span></Link>
                  </li>
                  <li>
                    <Link className='uppercase p-3 font-semibold ' to={'/streams'}>streams</Link>
                  </li>
                  <li id='profile-navbar' >
                    {!isAuthenticated ?
                      <Link to={'/login'}>
                        <div className="px-6 py-3 text-white  rounded-md bg-black max-md:px-5">
                          Log In
                        </div>
                      </Link>
                      :

                      (
                        profile &&
                        <ProfileMenu logoutHanlde={logoutHandle} profile={profile} screen='sm' />
                      )
                    }
                  </li>
                </div>
              </ul>
            </div>
          </div>
        </button>
        {/* cinepass log */}
        <Link to={`/home/${city}`}>
          <div className="gap-3 flex items-center  ml-12 md:ml-0 ">
            <img src={logo} alt="Cine pass Logo" className='object-cover max-w-20 max-h-20' />
            <span className='dancing-script text-2xl text-center align-middle '>Cinepass</span>
          </div>
        </Link>
        {/* navigation links */}
        <div className="nav_menu hidden  md:gap-2 lg:gap-5 md:flex   ">
          <Link className='hover:bg-blue-100 uppercase p-3 font-semibold  ' to={`/home/${city}`}>Home <span></span></Link>
          <MoviesTheatersDropdown
            city={`${city}`}
            item='movies'
            moviesOrTheater={memoizedMovies}
          />
          <Link className='hover:bg-blue-100 uppercase p-3 font-semibold ' to={'/streams'}>streams</Link>
        </div>
        {/* user profile icon in large screen */}
        <div className="auth-section hidden pl-6 text-base font-bold leading-6 text-center">
          {!isAuthenticated ?
            <Link to={'/login'}>
              <div className="px-6 py-3 text-white  rounded-md bg-black max-md:px-5">
                Log In
              </div>
            </Link>
            :

            (
              (
                profile &&
                <ProfileMenu logoutHanlde={logoutHandle} profile={profile} screen='large' />
              )
            )
          }

        </div>
      </nav >
    </>
  )
}

export default memo(UserNavBar)

