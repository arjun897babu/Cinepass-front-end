import { ITheaterOwnerEntity } from "./theater/ITheaterOwner";
import { ITheaterScreenResponse } from "./theater/ITheaterScreen";
import { IMovieShow } from "./theater/IMovieShow";
import { IPayment } from "./user/IPayment";
import { IUser } from "./user/IUserData";
export type IGetScreenCount = {
  total: number;
  available: number;
  'under-maintenance': number
}

export type IGetTicketCount = {
  total: number,
  canceled: number
}

export type IGetShowCountByScreen = {
  screenName: string,
  showCount: number
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}
export enum BookingStatus {
  BOOKED = 'booked',
  CANCELED = 'canceled'
}
export enum PurchasedItem {
  TICKET = 'ticket',
  RENTAL = 'rental'
}

export enum Period {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
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
  // data?: {
  //   [key: string]: string | number | boolean | object | any[];
  // },
  data?: {
    [key: string]:any;
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

export interface MovieResponse {
  maxPage: number,
  movies: (ITheaterMovieData | IStreamingMovieData)[]
}
export type IPlan = {
  _id: string;
  planName: string;
  price: number;
  validity: number;
  listed: boolean;
}
export interface VideoFile {
  secure_url: string;
  public_id: string;
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
  file?: File;
  plan?: string;
  slug?: string
}

export interface ITheaterMovieData {
  _id: string,
  movie_name: string;
  languages: string[];
  release_date: string;
  run_time: string;
  genres: string[];
  format: string[];
  cover_photo: string;
  listed: boolean;
  movie_poster: string;
  slug: string
}




export interface IStreamingMovieData extends ITheaterMovieData {
  plan: string,
  streamingPlan: IPlan;
  file: VideoFile;
  isPurchased: boolean
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
  openingDate: Date
  allowCancelation: boolean;
  cancelationDeadline: number;
  advanceBookingPeriod: number;
}

export interface IGetSingleShow {
  movie: Pick<IMovie, 'movie_name' | 'movie_poster' | 'release_date'>
  theater: Pick<ITheaterOwnerEntity, 'theater_name' | 'city'>
  screen: ITheaterScreenResponse
  show: Pick<IMovieShow, 'showTime' | 'endTime' | 'format' | 'language' | '_id' | 'cancelationDeadline' | 'reserved'>
}
export interface IPaymentSummaryLocationState {
  bookingDate: string | Date;
  showDetails: Omit<IGetSingleShow, 'show' | 'screen'> & {
    show: Omit<IGetSingleShow['show'], 'reserved'>; // Remove 'reserved'  
    screen: Omit<IGetSingleShow['screen'], 'layout'>; // Remove 'layout' field from 'screen'
  };
  showId: string;
  selectedSeats: string[];

}

export interface IStreamRentLocationState {
  streamingData: IStreamingMovieData;
  bookingDate: Date
}

export interface IRentSummaryLocationState {
  movieDetails: ITheaterMovieData
}

export enum Action {
  ADD = 'add',
  UPDATE = 'update',
  DELETE = 'delete'
}

export interface MovieFilter {
  bookingDate: string;
  search: string;
  format: string;
  genre: string;
  language: string;
  nowShowing: boolean;
}
export interface TicketFilter {
  status: BookingStatus
}

export interface IStreamRentalPlan {
  _id: string
  planName: string;
  price: number;
  validity: number; //representing the months
  listed: true
}

export interface RevenueFilter {
  period: Period;
  movieId?: string;
  screenId?: string;
}
export type IList = {
  label: string,
  id: string
}

export type RevenueData = {
  [key: string]: number
}

export type RevenueDetails = {
  name: string;
  id: string;
  data: RevenueData
}

export interface IRevenueResponse {
  list: IList[]
  revenue: RevenueDetails
}
export interface IStreamPlanFilter {
  pageNumber: number,
  listed: boolean,
  search: string,
  sort: boolean;
  all: boolean
}

export enum MovieFilterEnum {
  SEARCH = 'search',
  NOW_SHOWING = 'nowShowing',
  GENRE = 'genre',
  FORMAT = 'format',
  LANGUAGE = 'language'
}
export interface ITickets {
  _id: string;
  userId: string;
  theaterId: string;
  showId: string;
  paymentId: string;//paymentIntentId of the transaction
  bookingDate: Date;
  seats: string[];
  bookingStatus: BookingStatus;
  bookingCode: string
}
export enum MovieStatus {
  UPCOMING,
  RUNNING,
  COMPLETED
}

export interface IUserTicketData {
  paymentInfo: Pick<IPayment, 'extraCharge' | 'serviceCharge' | 'status' | 'totalAmount' | '_id' | 'paymentIntentId'>;
  TicketInfo: Pick<ITickets, '_id' | 'bookingStatus' | 'bookingDate' | 'seats' | 'bookingCode'>;
  movieInfo: IGetSingleShow['movie'];
  theaterInfo: IGetSingleShow['theater'];
  screenInfo: IGetSingleShow['screen'];
  showInfo: IGetSingleShow['show']
}

export interface ITheaterTicketData extends IUserTicketData {
  userInfo: Pick<IUser, '_id' | 'name' | 'email' | 'mobile_number' | 'profile_picture'>
}

export type IGetUserCount = {
  verified: number;
  active: number;
  blocked: number;
  nonVerified: number;
}
export type IGetTheaterOwnersCount = IGetUserCount & {
  approved: number
  rejected: number
  pending: number
}
export enum MovieType {
  theater = 'Theater',
  stream = 'Stream'
}
// export enum UserDoughnutChartLabel {
//   VERIFIED = 'Verified',
//   ACTIVE = 'Active',
//   BLOCKED = 'Blocked',
//   NON_VERIFIED = 'Non-Verified',
// }
// export enum TheaterDoughnutChartLabel {
//   VERIFIED = 'Verified',
//   ACTIVE = 'Active',
//   BLOCKED = 'Blocked',
//   NON_VERIFIED = 'Non-Verified',
//   APPROVED = 'Approved',
//   PENDING = 'Pending',
//   REJECTED = 'Rejected',
// }
