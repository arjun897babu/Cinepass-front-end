import { ForgotPassword } from "../../component/ForgotPassword"
import { Role } from "../../interface/Interface"

export const UserForgotPassword: React.FC = () => {
  return (
    <>
      <ForgotPassword role={Role.users} />
    </>
  )
}