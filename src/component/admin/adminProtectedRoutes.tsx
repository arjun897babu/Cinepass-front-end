 import { ReactNode } from "react"; 
import { Navigate,  } from "react-router-dom"; 
import { useSelector } from "react-redux";
import  type { Rootstate } from "../../redux/store";

interface children {
  children: ReactNode
}
export const AdminProtectedRoutes = ({ children }: children) => {

  const {isAuthenticated} = useSelector((state:RootState)=>state.admin)
 
  if (!isAuthenticated) {
    return <Navigate to={'/admin/login'}   />
  } else {
    return children
  }
}