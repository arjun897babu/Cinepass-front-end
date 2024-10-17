import React, { MouseEvent, useEffect, useState } from "react"
import { CiSearch } from "react-icons/ci"
import { IoLocation } from "react-icons/io5";
import { IoIosArrowDropdown } from "react-icons/io";

import { useNavigate } from "react-router-dom";
import LocationModal from "../../../pages/user/LocationModal";
import type { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllMovies } from "../../../redux/actions/userAction";
import useErrorHandler from "../../../hooks/useErrorHandler";
import { MovieFilter, Role } from "../../../interface/Interface";

export const SearchWithFilters: React.FC<{ setFilter: (filterItem: Partial<MovieFilter> | null) => void }> = ({ setFilter }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { city } = useSelector((state: RootState) => state.user)
  const [locationModal, setLocationModal] = useState(false)
  const navigate = useNavigate();


  const [nowShowing, setNowShowing] = useState(true)


  if (!city) {
    navigate('/')
  }

  const showModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setLocationModal(true)
  }

  const onClose = () => {
    setLocationModal(false);
  }
  const handleApiError = useErrorHandler(Role.users);

  const fetchFilteredMovies = async (isNowShowing: boolean) => {
    try {
      if (city) {
        await dispatch(getAllMovies({ city, filter: { nowShowing: isNowShowing } })).unwrap();
      }
    } catch (error) {
      handleApiError(error);
    }
  };


  const handleNowShowingClick = () => {
    setNowShowing(true);
    fetchFilteredMovies(true);
  };
  const handleUpcomingClick = () => {
    setNowShowing(false);
    fetchFilteredMovies(false);
  }

  useEffect(() => {
    setFilter({ nowShowing: nowShowing })
  }, [nowShowing])

  return (
    <>
      <div className='w-full object-scale-down  p-2 bg-white  flex  justify-between  items-center relative  group'>

        <div className="sm:w-72 p-1 bg-blue-100 flex justify-evenly  rounded-md">
          <button
            onClick={handleNowShowingClick}
            className={`${nowShowing && 'bg-white'} sm:w-full z p-1 text-xs  capitalize sm:text-sm text-slate-800`}
          > now showing
          </button>
          <button
            onClick={handleUpcomingClick}
            className={`z p-1 ${!nowShowing && 'bg-white'} sm:w-full   rounded-sm text-xs  capitalize sm:text-sm text-slate-800`}>Upcoming
          </button>
        </div>

        <div className="relative hidden">
          <CiSearch size={20} className="absolute top-2.5 left-2 text-gray-400" />
          <input type="search" placeholder="search movie, theater..." className="pl-10 pr-4 w-full h-9 placeholder-gray-400 text-gray-900 focus:outline-none" />
        </div>

        <div className="relative flex items-center p-1 border-2">
          <IoLocation />
          <button onClick={showModal} className="b-2  w-full h-full">{city}</button>
          {locationModal && < LocationModal onClose={onClose} />}
          <IoIosArrowDropdown />
        </div>
      </div>
    </>
  )
}