import { useEffect, useState } from "react";
import { LoggedUser } from "../interface/user/IUserData";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";


export const useLoggedUser = (): LoggedUser | null => {

  const { user, isUser } = useSelector((state: RootState) => state.user);
  const [loggedUser, setLoggedUser] = useState<LoggedUser | null>(null);

  // loggedUser when user state changes
  useEffect(() => {
    if (user) {
      setLoggedUser(user);  //  setting the first element of User

    } else {
      setLoggedUser(null)
    }
  }, [user])

  return loggedUser
}