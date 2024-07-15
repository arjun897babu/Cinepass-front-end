export interface IEndPoints {
  login: string;
  logout: string;
}

export interface UserEndpoint extends IEndPoints {
  signup: string;
  verifyOTP: string;
  resendOTP: string
}
export interface TheaterEndpoint extends IEndPoints {
  signup: string;
  verifyOTP: string;
  resendOTP: string
}
export interface AdminEndpoint extends IEndPoints {

}