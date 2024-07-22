 import { ReactNode } from "react"; 
import { Navigate,  } from "react-router-dom";
import { useLoggedOwner } from "../../hooks/useLoggedUser";
import { Role } from "../../interface/Interface";

interface children {
  children: ReactNode
}
export const AdminProtectedRoutes = ({ children }: children) => {

  const {isAuthenticated} = useLoggedOwner(Role.admin)
 
  if (!isAuthenticated) {
    return <Navigate to={'/admin/login'}   />
  } else {
    return children
  }
}