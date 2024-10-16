import React, { MouseEvent, useEffect, useRef, useState } from "react";
import type { AppDispatch } from "../../redux/store";
import { useDispatch } from "react-redux";
import { getAllCities } from "../../redux/actions/userAction";
 import { userSetCity } from "../../redux/reducers/userReducer";
import { Loader } from "../../component/Loader";
interface LocationModalProps {
  onClose?: () => void
}
const LocationModal: React.FC<LocationModalProps> = ({ onClose }) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [cities, setCities] = useState<string[] | []>([]);
  const dispatch = useDispatch<AppDispatch>()
  const modalRef = useRef<HTMLDialogElement>(null)
  const fetchCities = async () => {
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

  const handleCitySelect = (selectedCity: string) => {

    modalRef.current?.close()
    dispatch(userSetCity(selectedCity))
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

  if (cities.length === 0) {
    return <></>
  }

  if (loading) return <div className=""><Loader /></div>

  return (
    <>
      <dialog ref={modalRef} className="modal modal-open ">
        <div className="modal-box ">
          {onClose && <div className="flex justify-end">
            <button onClick={closeModal} className="btn btn-sm btn-circle">✕</button>
          </div>}
          <h3 className="font-bold text-2xl text-center capitalize mb-7 ">select your city</h3>


          <div className="p-1 m-1 flex gap-2">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => handleCitySelect(city)}
                className="p-2 hover:bg-gray-200 rounded bg-sky-200 font-medium"
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