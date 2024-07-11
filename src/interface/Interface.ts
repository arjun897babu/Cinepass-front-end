
export enum ResponseStatus {
  success = 'Success',
  Error = 'Error'
}

export interface LoginData {
  email: string;
  password: string;
}

export interface IInitialStateError{
  error:string
  field:string
  message:string
}

export interface ResponseData {
  status: ResponseStatus;
  message: string;
  error?:Error
}

export interface OTPVerification {
  email: string;
  otp: string
}




