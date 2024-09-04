import {   MouseEvent  } from "react";
 import {    ResponseStatus, Role } from "../interface/Interface"
import { resendOTPUser } from "../redux/actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import {   isResponseError } from "../utils/customError";
import { resendOTPTheaters } from "../redux/actions/theaterAction";
import { Toast } from "./Toast2";

interface ResendOTPProps {
  role: Role;
  isActive: boolean;
  resetTimer: () => void
  setToast: (toast: Toast) => void
}

const ResendOTP: React.FC<ResendOTPProps> = ({ role, isActive, setToast, resetTimer }) => {
  const { tempMail } = useSelector((state: RootState) => {
    switch (role) {
      case Role.users:
        return state.user;
      case Role.theaters:
        return state.theaters;
      case Role.admin:
        return state.admin;

      default:
        return {   tempMail: null  };
    }
  }); 
  
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
          setToast({
            alert: result.status,
            message: result.message
          })
        }
      }
    } catch (error) {
      if (isResponseError(error)) {
        if (error.statusCode === 403) {
          navigate(role === Role.theaters ? '/theaters/login' : '/login', {
            replace: true, state: { blocked: true }
          })
        } else {
          navigate(role === Role.theaters ? '/theaters/login' : '/login', {
            replace: true,
          })
          setToast({
            alert: ResponseStatus.ERROR,
            message: error.data.message
          })
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