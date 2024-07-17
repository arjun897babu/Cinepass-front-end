import { RootState } from "../../redux/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate,  } from "react-router-dom";

interface children {
  children: ReactNode
}
export const TheaterProtectedRoutes = ({ children }: children) => {

  const { isAuthenticated } = useSelector((state: RootState) => state.theater);
 
  if (!isAuthenticated) {
    return <Navigate to={'/theaters/login'}   />
  } else {
    return children
  }
}