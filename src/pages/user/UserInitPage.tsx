import React, { useEffect } from "react"

import LocationModal from "./LocationModal";
import { useLoggedOwner } from "../../hooks/useLoggedUser";
import { Role } from "../../interface/Interface";
import { useNavigate } from "react-router-dom";

const UserInitPage: React.FC = () => {
  const { city } = useLoggedOwner(Role.users)
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
