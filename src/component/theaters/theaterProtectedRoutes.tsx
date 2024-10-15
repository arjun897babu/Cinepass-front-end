import { ReactNode } from "react";
import { Navigate, } from "react-router-dom";
 
import  type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

interface children {
  children: ReactNode
}
export const TheaterProtectedRoutes = ({ children }: children) => {

  const { isAuthenticated } =useSelector((state:RootState)=>state.theaters)
  if (!isAuthenticated) {
    return <Navigate to={'/theaters/login'} replace={true} />
  } else {
    return children
  }
}