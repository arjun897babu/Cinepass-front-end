import React, { useEffect, useState } from "react"
import { FaArrowLeft } from "react-icons/fa"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import useErrorHandler from "../../hooks/useErrorHandler"
import { IGetSingleShow, ResponseStatus, Role } from "../../interface/Interface"
import { Toast } from "../../component/Toast2"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../redux/store"
import { getSingleShowDetails } from "../../redux/actions/userAction"
import screen_layout_icon from '/screen_icon.svg'

const ScreenLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { city } = useSelector((state: RootState) => state.user)

  const location = useLocation()
  console.log(location.state)

  const [toastmessage, setToastMessage] = useState<Toast | null>(null)
  const setToast = (toast: Toast) => setToastMessage(
    {
      alert: toast.alert,
      message: toast.message
    }
  )

  const [showDetails, setShowDetails] = useState<IGetSingleShow | null>(null)


  const { showId } = useParams()
  const handleApiError = useErrorHandler(Role.users, setToast)
  async function getSingleShow() {
    try {
      if (city && showId) {
        const respone = await dispatch(getSingleShowDetails({ city, showId })).unwrap()
        if (respone.status === ResponseStatus.SUCCESS) {
          setShowDetails(respone.data.shows)
        }
      }
    } catch (error) {
      handleApiError(error)
    }
  }

  useEffect(() => {
    if (city && showId) {
      getSingleShow()
    }
  }, [showId])
  return (
    <>
      <div className="bg-white h-screen flex flex-col ">
        {/* theater and show details */}
        <div className=" space-y-2 sm:flex p-2 items-center justify-between gap-3">
          <div className="join items-center gap-4 ">
            <FaArrowLeft size={20} onClick={() => navigate(-1)} className="cursor-pointer"  />
            <div className="join join-vertical gap-3">
              <h2 className="join-item font-semibold">Dead pool and wolverine </h2>
              <h6 className="join-item text-xs">Crown Theater Dolby Atoms , Calicut | Saturday, June 22, 2024, 9:00. PM </h6>
            </div>
          </div>
          <div className="join gap-3">
            <div className="border border-sky-300  rounded-md w-7 h-7" /><span className="">available</span>
            <div className="rounded-md w-7 h-7 bg-gray-400" /><span className="">booked</span>
            <div className="rounded-md w-7 h-7 bg-sky-400" /><span className="">selected</span>
          </div>
        </div>
        <div className="divider mt-0 pt-0"></div>

        {/* seat layout */}
        <div className="flex-grow overflow-y-auto  ">
          <div className="seatlayout flex justify-center gap-2 p-2 'min-w-max' flex-col "> 
             
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" /> 
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
            <div className="rounded-md w-7 h-7 bg-sky-400" />
          </div>
        </div>
        <div className="flex justify-center p-2">
          <img src={screen_layout_icon} alt="" />
        </div>

        {/* ticket details */}
        {
          <div className="flex justify-evenly gap-3 p-2 border-y">
            <div className="join join-vertical  space-y-2">
              <span className="join-item">₹280</span>
              <p className="join join-item gap-2">
                <p className="join-item capitalize">tickets</p>
                <span>:</span>
                <span className="join-item ">2*140</span>
              </p>
            </div>
            <button className="button btn-wide bg-sky-300 rounded-md">Book tickets</button>
          </div>
        }

      </div>

    </>
  )
}

export default ScreenLayout