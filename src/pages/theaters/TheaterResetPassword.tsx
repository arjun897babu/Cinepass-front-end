import React from "react"
import ResetPassWord from "../../component/ResetPassword"
import { Role } from "../../interface/Interface"

export const TheaterResetPassWord: React.FC = () => {
  return (
    <>
      <ResetPassWord role={Role.theaters} />
    </>
  )
}