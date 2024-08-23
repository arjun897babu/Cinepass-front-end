import React, { useEffect } from "react";
import { ResponseStatus, Role } from "../interface/Interface";
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";


export type Toast = {
  alert: ResponseStatus;
  message: string
}

interface ToastProps {
  alert: ResponseStatus, // success or false
  message: string, // alert message
  clearToast: () => void
  modalToast?: boolean

}

const Toast2: React.FC<ToastProps> = ({ alert, message, clearToast, modalToast }) => {
  console.log(message)
  useEffect(() => {

    const timeout = setTimeout(() => {
      clearToast();

    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);


  return (
    <>
      <div className={`toast ${modalToast ? "toast-top toast-end absolute " : " toast-center"} z-1`}>
        <div className={` bg-white  max-w-xl alert  rounded-lg  flex items-center ${alert === ResponseStatus.SUCCESS ? 'text-success border-success' : 'text-error border-error'}`}>
          {alert === ResponseStatus.success ? <FaCheckCircle className="mr-1 " /> : <MdError className="mr-1 " />}
          <span>{message}.</span>
        </div>
      </div>
    </>
  )
}

export default Toast2