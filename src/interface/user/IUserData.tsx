import { LoginData } from "../Interface";


export interface UserSignUpData extends LoginData {
  mobile_number: string,
  confirm_password?: string;
}


export interface LoggedOwner {
  name: string;
  email: string;
  mobile_number?: number;
  profile_picture?: string | null;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  mobile_number: number;
  verified: boolean;
  status: boolean;
  profile_picture: string,
  location: string
  isGoogleAuth:boolean
} 