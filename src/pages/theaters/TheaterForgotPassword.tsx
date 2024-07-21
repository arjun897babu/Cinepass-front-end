import { ForgotPassword } from "../../component/ForgotPassword"
import { Role } from "../../interface/Interface"

export const TheaterForgotPassword: React.FC = () => {
  return (
    <>
      <ForgotPassword role={Role.theaters} />
    </>
  )
}