import { IInitialStateError } from "../../interface/Interface";
import { LoggedOwner } from "../../interface/user/IUserData";

export interface IInitialState {
  owner: LoggedOwner | null;
  loading: boolean;
  error: IInitialStateError | null;
  isAuthenticated: boolean
  tempMail: { email: string } | null,
  isGoogleAuth?: boolean
  city?: undefined|string

}
