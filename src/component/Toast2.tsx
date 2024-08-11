import React from "react";
import { ResponseStatus } from "../interface/Interface";
import { FaCheckCircle } from "react-icons/fa";

const Toast2: React.FC<{ alert: ResponseStatus, message: string, clearToast: () => void }> = ({ alert, message, clearToast }) => {
console.log(message)
  setTimeout(() => {
    clearToast()
  }, 2000)


  return (
    <>
      <div className="toast toast-center">
        <div className={` bg-white  max-w-sm alert rounded-lg  flex items-center ${alert === ResponseStatus.SUCCESS ? 'text-success border-success' : 'text-error border-error'}`}>
          <FaCheckCircle className="mr-2" /> 
          <span>{message}.</span>
        </div>
      </div>
    </>
  )
}

export default Toast2