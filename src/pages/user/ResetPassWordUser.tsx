import React from "react"
import ResetPassWord from "../../component/ResetPassword"
import { Role } from "../../interface/Interface"

export const ResetPassWordUser: React.FC = () => {
  return (
    <>
      <ResetPassWord role={Role.users} />
    </>
  )
}