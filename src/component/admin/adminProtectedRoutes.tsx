import { RootState } from "../../redux/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate,  } from "react-router-dom";

interface children {
  children: ReactNode
}
export const AdminProtectedRoutes = ({ children }: children) => {

  const { isAuthenticated } = useSelector((state: RootState) => state.admin);
 
  if (!isAuthenticated) {
    return <Navigate to={'/admin/login'}   />
  } else {
    return children
  }
}