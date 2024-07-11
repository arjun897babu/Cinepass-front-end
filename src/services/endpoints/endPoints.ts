import { UserEndPoints } from "./IEndPoints";

export const userEndPoints: UserEndPoints = {
  
  signup: 'users/signup',
  login: 'users/login',
  logout:'users/logout',
  verifyOTP: 'users/otp-verification',
  resendOTP: 'users/otp-resend'
};
export const theatersEndPoints: UserEndPoints = {
  
  signup: 'theaters/signup',
  login: 'theaters/login',
  logout:'theaters/logout',
  verifyOTP: 'theaters/otp-verification',
  resendOTP: 'theaters/otp-resend'
};

