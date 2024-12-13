import React, { MouseEvent, useEffect, useRef, useState } from "react";
import type { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllCities } from "../../redux/actions/userAction";
import { userSetCity } from "../../redux/reducers/userReducer";
import { useNavigate } from "react-router-dom";
interface LocationModalProps {
  onClose?: () => void
}
const LocationModal: React.FC<LocationModalProps> = ({ onClose }) => {
  console.log('renderin')
  const navigate = useNavigate()
  const { movies, city } = useSelector((state: RootState) => state.user)
  const [loading, setLoading] = useState<boolean>(false);
  const [cities, setCities] = useState<string[] | []>([]);
  const dispatch = useDispatch<AppDispatch>()
  const modalRef = useRef<HTMLDialogElement>(null)

  const fetchCities = async () => {
    console.log('calling city api')
    try {
      setLoading(true);
      const response = await dispatch(getAllCities()).unwrap()
      setCities(response)
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }

  const handleCitySelect = (e: MouseEvent<HTMLButtonElement>, selectedCity: string) => {
    e.preventDefault()
    if (!selectedCity) {
      return
    }
    dispatch(userSetCity(selectedCity)) 
    navigate(`/home/${selectedCity}`) 
  };

  const closeModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClose ?
      onClose()
      : null
  }

  useEffect(() => {
    fetchCities()

    return () => {
      if (modalRef.current) {
        modalRef.current.close()
      }

    }

  }, [])

  return (
    <>
      <dialog ref={modalRef} className="modal modal-open ">
        {
          loading ?
            (<div className="modal-box  ">
              <h3 className="font-bold text-2xl text-center capitalize mb-7 ">select your city</h3>
              <div className="flex justify-center">
                <span className="loading text-info"></span>
              </div>
            </div>
            ) :
            (
              <div className="modal-box ">
                {
                  onClose &&
                  <div className="flex justify-end">
                    <button onClick={closeModal} className="btn btn-sm btn-circle">✕</button>
                  </div>
                }
                <h3 className="font-bold text-2xl text-center capitalize mb-7 ">select your city</h3>
                {
                  city
                  &&
                  !movies
                  &&
                  < h1 className="text-sm font-medium capitalize text-center">no shows available,please choose a city</h1>
                }
                <div className="p-1 m-1 flex   gap-2">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={(e) => handleCitySelect(e, city)}
                      className="p-2 hover:bg-gray-200 rounded bg-sky-200 font-medium"
                    >
                      {city}
                    </button>
                  ))}

                </div>



              </div>
            )
        }


      </dialog >
    </>
  )
}

export default LocationModal