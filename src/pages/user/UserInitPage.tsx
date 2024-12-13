import React, { useEffect } from "react"
import LocationModal from "./LocationModal";
import { useNavigate } from "react-router-dom";
import { shallowEqual, useSelector } from "react-redux";
import type { RootState, } from "../../redux/store";

const UserInitPage: React.FC = () => {
  console.log('rendering userinit')
  const { city } = useSelector((state: RootState) => ({ city: state.user.city }), shallowEqual);

  const navigate = useNavigate();

  useEffect(() => {
    if (city) {
      navigate(`/home/${city}`);
    }
  }, [city]);

  return (
    <div className="h-screen">
      {!city && <LocationModal />}
    </div>
  );
};

export default UserInitPage;
