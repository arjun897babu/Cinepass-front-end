import { LoginData } from "../Interface";


export interface UserSingUpData extends LoginData {
  mobile_number: string,
  confirm_password?: string;
}



