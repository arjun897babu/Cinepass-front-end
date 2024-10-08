import { IInitialStateError, IMovie, IPaymentSummaryLocationState } from "../../interface/Interface";
import { ITheaterOwnerEntity } from "../../interface/theater/ITheaterOwner";
import { LoggedOwner } from "../../interface/user/IUserData";

 

export interface IInitialState {
  profile: LoggedOwner | null;
  error: IInitialStateError | null;
  isAuthenticated: boolean
  tempMail: { email: string } | null,
  isGoogleAuth?: boolean
  city?: undefined | string
  movies?: IMovie[] | null
  cityTheaters?: Partial<ITheaterOwnerEntity>[]
  bookingInfo?: IPaymentSummaryLocationState | null
}


