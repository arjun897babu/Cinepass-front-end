import { RootState } from "../../redux/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

interface children {
  children: ReactNode
}
export const ProtectedRoutes = ({ children }: children) => {
  const location = useLocation()
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
 
  if (!isAuthenticated) {
    return <Navigate to={'/'} state={{ from: location }} replace  />
  } else {
    return children
  }
}