import { LoginData } from "../Interface";


export interface UserSingUpData extends LoginData {
  mobile_number: string,
  confirm_password?: string;
}


export interface LoggedOwner {
  name: string;
  email: string;
  mobile_number?: number;
  verified?: boolean;
  status?: string;
  profile_picture?: string | null;
   
}
