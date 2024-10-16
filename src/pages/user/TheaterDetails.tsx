import { useDispatch, useSelector } from "react-redux"
import { useLocation, useParams } from "react-router-dom"
import { AppDispatch, RootState } from "../../redux/store"
import { getAllShows } from "../../redux/actions/userAction"
import { useEffect, useState } from "react"

const TheaterDetails = () => {
  const location = useLocation()
  const { theaterId } = useParams()
 
  const { city } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>() 
  
  const fetchMoviesandShows = async () => {
  
    try {
      if (city && theaterId) {
        const response = await dispatch(getAllShows({ city, theaterId })).unwrap()
        console.log(response) 
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (theaterId && city) {
      fetchMoviesandShows()
    }
  }, [theaterId, city])

  return (
    <>
    theater detail page
      <h1 className="text-black">{location.state.theater.theater_name}</h1>
    </>
  )
}

export default TheaterDetails