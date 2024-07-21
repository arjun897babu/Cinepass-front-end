
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
  }
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
  ACTIVE = "active",
  BLOCKED = "blocked",
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

