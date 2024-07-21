import { AppDispatch, RootState } from "../../redux/store";
import { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, } from "react-router-dom";
import { setUserAuthentication } from "../../redux/reducers/userReducer";

interface children {
  children: ReactNode
}
export const ProtectedRoutes = ({ children }: children) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  // const dispatch = useDispatch<AppDispatch>();

  // (() => {

  //     dispatch(setUserAuthentication())

  // })()

  if (!isAuthenticated) {
    return <Navigate to={'/login'} />
  } else {
    return children
  }
}