import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { getAllCities } from "../../redux/actions/userAction";
import { Link, useNavigate } from "react-router-dom";
interface LocationModalProps {
  onClose?: () => void
}
const LocationModal: React.FC<LocationModalProps> = ({ onClose }) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [cities, setCities] = useState<string[] | []>([]);
  const dispatch = useDispatch<AppDispatch>()
  const modalRef = useRef<HTMLDialogElement>(null)
  const navigate = useNavigate()
  const fetchCities = async () => {
    try {
      setLoading((prev) => !prev);
      const response = await dispatch(getAllCities()).unwrap()
      setCities(response)
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading((prev) => !prev)
    }
  }
  
  const handleCitySelect = (selectedCity: string) => {

    modalRef.current?.close()
    window.location.href = `/home/${selectedCity}`;
    onClose ?
      onClose()
      : null
  };

  const closeModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    modalRef.current?.close();
    onClose ?
      onClose()
      : null

  }
  useEffect(() => {
    fetchCities()
  }, [])

  if(cities.length===0){
    return <></>
  }

  return (
    <>
      <dialog ref={modalRef} className="modal modal-open ">
        <div className="modal-box ">
          {onClose && <div className="flex justify-end">
            <button onClick={closeModal} className="btn btn-sm btn-circle">✕</button>
          </div>}
          <h3 className="font-bold text-2xl text-center capitalize ">select your city</h3>
          
          
          
              <div className="p-1 m-1">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCitySelect(city)}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    {city}
                  </button>
                ))}

              </div>
            
             
            
        </div>
      </dialog >
    </>
  )
}

export default LocationModal