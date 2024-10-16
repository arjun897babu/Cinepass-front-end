import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../../redux/store"
import { getTheaterDetails } from "../../../redux/actions/theaterAction"

import { ITheaterOwnerEntity } from "../../../interface/theater/ITheaterOwner"

import Toast2, { Toast } from "../../../component/Toast2"
import TheaterInfo from "../../../component/theaters/TheaterInfo"
import TheaterOwnerInfo from "../../../component/theaters/TheaterOwnerInfo"

import { ResponseStatus, } from "../../../interface/Interface"
import { isResponseError } from "../../../utils/customError"
import { useNavigate } from "react-router-dom"
import { Loader } from "../../../component/Loader"

const TheaterDetail: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>();
  const [theaterData, setTheaterData] = useState<ITheaterOwnerEntity | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<Toast | null>(null)
  const clearToast = () => setToast(null)
  const updateToastData = (toastData: Toast) => {
    setToast(toastData)
  }
  const fetchTheaterDetails = async () => {
    try {
      setLoading(true)
      const response = await dispatch(getTheaterDetails()).unwrap();
      setTheaterData(response);
    } catch (error) {
      if (isResponseError(error)) {
        if (error.statusCode === 403) {
          navigate('/theaters/login', { replace: true, state: { blocked: true } })
        }
        else if (error.statusCode == 404) {
          setToast({
            alert: ResponseStatus.ERROR,
            message: error.data.message
          })
        } else if (error.statusCode === 500) {
          setToast({
            alert: ResponseStatus.ERROR,
            message: error.data.message
          })
        }

      }
    } finally {
      setLoading(false)
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

  useEffect(() => {
    fetchTheaterDetails()
  }, [])

  if (loading) return <div className=""><Loader /></div>
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