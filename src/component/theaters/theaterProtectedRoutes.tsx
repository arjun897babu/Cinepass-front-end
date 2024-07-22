import { ReactNode } from "react";
import { Navigate,  } from "react-router-dom";
import { useLoggedOwner } from "../../hooks/useLoggedUser";
import { Role } from "../../interface/Interface";

interface children {
  children: ReactNode
}
export const TheaterProtectedRoutes = ({ children }: children) => {

  const {isAuthenticated} = useLoggedOwner(Role.theaters)
 
  if (!isAuthenticated) {
    return <Navigate to={'/theaters/login'}   />
  } else {
    return children
  }
}