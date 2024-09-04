import { FieldValues } from "react-hook-form";
import { ITheaterOwnerEntity } from "./theater/ITheaterOwner";
import { ITheaterScreenResponse } from "./theater/ITheaterScreen";
 

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
export interface ResponseData2 {
  status: ResponseStatus;
  message: string;
  error?: IInitialStateError | null,
  redirectURL?: string
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

export interface GoogleSignUp {
  credential: string,
  client_id: string
}


export interface ICast {
  image: string;
  name: string;
}

export interface IMovie {
  _id?: string;
  movie_name: string;
  languages: string[];
  release_date: (string | Date);
  run_time: string;
  genres: string[];
  format: string[];
  cover_photo: string  
  listed?: boolean;
  movie_poster: string 
  cast?: ICast[];
  trailer?: string;
  file?: string;
  plan?: string;
  slug?: string
}

export interface ISeat {
  name: string,
  booked: boolean,
}

export interface ITheaterScreen {
  _id?: string;
  theaterId?: string
  screen_name: string,
  seating_capacity: number,
  rows: number,
  column: number,
  screen_format: string[] // specification of the screen 
  chargePerSeat: number
  layout: Array<Array<ISeat>>;
}
export interface IGetMovieShowResponse {
  _id: string,
  showTime: string,
  endTime: string,
  language: string,
  format: string,
  theater: Pick<ITheaterOwnerEntity, '_id' | 'address' | 'city' | 'theater_name'>
  movie: IMovie,
  screen: Pick<ITheaterScreenResponse, '_id' | 'amenity' | 'screen_name'>
  opening_date?:string|Date
}

export interface IGetSingleShow {
  movie: {
    movie_name: Pick<IMovie, 'movie_name'>
  };
  theater: {
    theater_name: Pick<ITheaterOwnerEntity, 'theater_name'>
  };
  screen: {
    name: Pick<ITheaterScreen, 'screen_name'>;
    layout: Pick<ITheaterScreen, 'layout'>;
  };
  show: Partial<IMovie>
}

export enum Action   {
  ADD = 'add',
  UPDATE='update',
  DELETE='delete'
}

