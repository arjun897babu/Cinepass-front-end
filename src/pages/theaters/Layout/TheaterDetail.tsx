import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { AppDispatch } from "../../../redux/store"
import { getTheaterDetails } from "../../../redux/actions/theaterAction"

import { ITheaterOwnerEntity } from "../../../interface/theater/ITheaterOwner"

import Toast2, { Toast } from "../../../component/Toast2"
import TheaterInfo from "../../../component/theaters/TheaterInfo"
import TheaterOwnerInfo from "../../../component/theaters/TheaterOwnerInfo"
import { useLoggedOwner } from "../../../hooks/useLoggedUser"
import { Role } from "../../../interface/Interface"

const TheaterDetail: React.FC = () => {

  const dispatch = useDispatch<AppDispatch>();
  const [theaterData, setTheaterData] = useState<ITheaterOwnerEntity | null>(null);
  const [toast, setToast] = useState<Toast | null>(null)
  const clearToast = () => setToast(null)
  const updateToastData = (toastData: Toast) => {
    setToast(toastData)
  }
  const fetchTheaterDetails = async () => {
    try {
      const response = await dispatch(getTheaterDetails()).unwrap();
      setTheaterData(response);
    } catch (error) {
      console.log(error)
    }
  }

  const setTheaterDataResponse = (updatedData: ITheaterOwnerEntity) => {

    setTheaterData((prev) =>
      prev?._id === updatedData._id ?
        { ...prev, ...updatedData } :
        prev
    );
    console.log('data updated')

  };
  console.log(theaterData)
  useEffect(() => {
    fetchTheaterDetails()
  }, [])
  return (
    <>

      {
        toast &&
        <Toast2
          alert={toast.alert}
          clearToast={clearToast}
          message={toast.message}
        />
      }
      {
        theaterData &&

        <>

          <div className=" md:flex md:justify-between">
            <div className="md:w-1/2">
              <TheaterInfo
                selectedData={theaterData}
                setTheaterDataResponse={setTheaterDataResponse}
                setToast={updateToastData}
              />
            </div>
            <div className=" mt-2 md:w-2/5 ">
              <TheaterOwnerInfo
                data={theaterData}
                setTheaterDataResponse={setTheaterDataResponse}
                setToast={updateToastData}
              />
            </div>
          </div>

        </>
      }
    </>
  )
}

export default TheaterDetail