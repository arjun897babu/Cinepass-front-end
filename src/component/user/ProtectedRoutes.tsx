import { RootState } from "../../redux/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface children {
  children: ReactNode
}
export const ProtectedRoutes = ({ children }: children) => {

  const { user } = useSelector((state: RootState) => state.user);
  console.log(user)
  if (!user) {
    return <Navigate to={'/'} />
  } else {
    return children
  }
}