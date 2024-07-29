
export enum ResponseStatus {
  success = 'Success',
  Error = 'Error'
}

export enum Role {
  users = 'users',
  admin = 'admin',
  theaters = 'theaters'
};
export interface LoginData {
  email: string;
  password: string;
}

export interface IInitialStateError {
  error: string
  message: string
}

export interface ResponseData {
  status: ResponseStatus;
  message: string;
  error?: IInitialStateError | null,
  data?: {
    [key: string]: string | number | boolean | object | any[];
  },
  redirectURL: string
}

export interface OTPVerification {
  email: string;
  otp: string
}
export enum ResponseStatus {
  SUCCESS = 'Success',
  ERROR = 'Error',
}

export enum Status {
  ACTIVE = "Active",
  BLOCKED = "Blocked",
}
export enum ApprovalStatus {
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PENDING = 'pending'
}
export interface ApprovalResponse {
  _id: string,
  approval_status: string
}

export interface GoogleSignUp{
  credential:string,
  client_id :string
}

export interface ICast {
  image: string;
  name: string;
}

export interface ITheaterMovie {
  _id: string;
  movie_name: string;
  language: string[];
  booking_date: Date;
  listed: boolean;
  release_data: Date;
  trailer: string;
  duration: string;
  genre: string[];
  cast: ICast[];
  cover_photo: string;
  movie_poster: string;
  format: string[];
}
