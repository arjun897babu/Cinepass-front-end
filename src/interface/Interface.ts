
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
  message:string
}

export interface ResponseData {
  status: ResponseStatus;
  message: string;
  error?:IInitialStateError|null,
  data?:any[],
  redirectURL:string
}

export interface OTPVerification {
  email: string;
  otp: string
}
export enum ResponseStatus {
  SUCCESS = 'Success',
  ERROR = 'Error',
}




