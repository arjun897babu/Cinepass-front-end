import { AppDispatch, RootState } from "../../redux/store";
import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, } from "react-router-dom";
import { setUserAuthentication } from "../../redux/reducers/userReducer";

interface children {
  children: ReactNode
}
export const ProtectedRoutes = ({ children }: children) => {
  const { isAuthenticated, city } = useSelector((state: RootState) => state.user);

  if (!city) {
    return <Navigate to={'/'} />
  }

  if (!isAuthenticated) {
    return <Navigate to={'/login'} replace={true} />
  } else {
    return children
  }
}