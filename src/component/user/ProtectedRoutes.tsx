import { RootState } from "../../redux/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate,  } from "react-router-dom";

interface children {
  children: ReactNode
}
export const ProtectedRoutes = ({ children }: children) => {
  console.log('protected route is working')
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
 
  if (!isAuthenticated) {
    return <Navigate to={'/login'}   />
  } else {
    return children
  }
}