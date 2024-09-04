import React, { useEffect } from "react"

import LocationModal from "./LocationModal";
 
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import  type { RootState,  } from "../../redux/store";

const UserInitPage: React.FC = () => {
  const { city } = useSelector((state:RootState)=>state.user)
  const navigate = useNavigate();

  useEffect(() => {
    if (city) {
      navigate(`/home/${city}`);
    }
  }, [city, navigate]);


  if (city) return
  return (
    <>
      <div className="h-screen">
        <LocationModal />
      </div >

    </>
  )
}

export default UserInitPage
