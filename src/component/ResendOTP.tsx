import { Dispatch, MouseEvent, SetStateAction } from "react";
import { useLoggedOwner } from "../hooks/useLoggedUser";
import { ResponseData, ResponseStatus, Role } from "../interface/Interface"
import { resendOTPUser } from "../redux/actions/userAction";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { isErrorResponse } from "../utils/customError";
import { resendOTPTheaters } from "../redux/actions/theaterAction";

interface ResendOTPProps {
  role: Role;
  isActive: boolean;
  resetTimer: () => void
  setResponse: Dispatch<SetStateAction<ResponseData | null>>
}

const ResendOTP: React.FC<ResendOTPProps> = ({ role, isActive, setResponse, resetTimer }) => {
  const { tempMail } = useLoggedOwner(role);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()

  const resendOTP = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      if (tempMail) {
        let result
        if (role === Role.users) {
          result = await dispatch(resendOTPUser(tempMail.email)).unwrap()
        } else {
          result = await dispatch(resendOTPTheaters(tempMail.email)).unwrap()
        }

        if (result.status === ResponseStatus.SUCCESS) {
          resetTimer();
          setTimeout(() => {
            setResponse(null)
          }, 2000)
          setResponse(prevResponse => ({
            ...prevResponse,
            message: result.message,
            status: result.status,
            redirectURL: result.redirectURL,
          }));
        }
      } else {
        setTimeout(() => {
          navigate( `${Role.users === role ? '/login' : `/${role}/login`}`)
          setResponse(null)
        }, 2000)
        setResponse((prevResponse) => ({
          ...prevResponse,
          message: 'Something went wrong',
          status: ResponseStatus.ERROR,
          redirectURL: `#`
        }))

      }
    } catch (error) {
      if (isErrorResponse(error)) {

        if (error.error?.error !== 'otp') {
          setTimeout(() => {
            navigate( `${Role.users === role ? '/login' : `/${role}/login`}`)
          }, 2000)
          setResponse({ message: error.message, status: error.status, redirectURL: error?.redirectURL })
        }
      }
    }

  }
  return (
    <>
      <button onClick={resendOTP} className={` ${isActive ? 'text-gray-500' : "text-white"} font-extrabold  mt-2 text-xs `} disabled={isActive} >
        Resend OTP
      </button >
    </>
  )

}

export default ResendOTP