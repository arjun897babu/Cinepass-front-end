import { LoginData, ResponseData } from "../Interface";


export interface UserSingUpData extends LoginData {
  mobile_number: string,
  confirm_password?: string;
}

export interface SignUpResponse extends ResponseData{
  data:{
    email:string;
  }
}

