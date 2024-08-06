import React, { lazy, useEffect, useState } from "react"
import { Loader } from "../../component/Loader"
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { getAllCities } from "../../redux/actions/userAction";
import { Link } from "react-router-dom";

const UserInitPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [cities, setCities] = useState<string[] | []>([]);
  const dispatch = useDispatch<AppDispatch>()

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

   

  useEffect(() => {
    fetchCities()
  }, [])

  if (loading) return <Loader />
  return (
    <>
      <div className="h-screen">
        <dialog id="my_modal_4" className="modal modal-open ">
          <div className="modal-box w-11/12 max-w-5xl">
            <h3 className="font-bold text-2xl text-center capitalize ">select your city</h3>
            {
              cities?.length > 0 ? (
                <div className="grid col-span-5 space-x-1">
                  {cities.map((city) => {
                    return <Link key={city} to={`/home/${city}`}><div className="p-1 m-1">{city}</div> </Link>
                  })}

                </div>
              ) : (
                <div></div>
              )
            }
          </div>
        </dialog >
      </div >

    </>
  )
}

export default UserInitPage
