import { useEffect, useState } from "react";
import { LoggedOwner } from "../interface/user/IUserData";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { IInitialStateError, Role } from "../interface/Interface";

interface LoggedOwnerState {
  loggedOwner: LoggedOwner | null
  isAuthenticated: boolean
  error: IInitialStateError | null,
  loading: boolean,
  tempMail: { email: string; } | null,
  city: undefined | string
}



export const useLoggedOwner = (role: Role): LoggedOwnerState => {

  const { owner, isAuthenticated, error, loading, tempMail, city } = useSelector((state: RootState) => {
    switch (role) {
      case Role.admin:
        return state.admin;
      case Role.theaters:
        return state.theaters;
      case Role.users:
        return state.user;
      default:
        return { owner: null, isAuthenticated: false, error: null, loading: false, tempMail: null, city: undefined };
    }
  });

  const [loggedOwner, setLoggedOwner] = useState<LoggedOwner | null>(null);
  // loggedOwner when user state changes
  useEffect(() => {
    if (owner) {
      setLoggedOwner(owner);

    } else {
      setLoggedOwner(null)
    }
  }, [owner, loading, isAuthenticated])

  return { isAuthenticated, loggedOwner, error, loading, tempMail, city }
}