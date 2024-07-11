import { LoginData } from "../Interface";

export interface TheaterSignUpData extends LoginData {
  adhaar_number: string;
  theater_license: string;
  confirm_password:string
}

