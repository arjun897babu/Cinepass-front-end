import { UserEndpoint, AdminEndpoint, TheaterEndpoint } from "./IEndPoints";

export const userEndPoints: UserEndpoint = {

  signup: 'users/signup',
  login: 'users/login',
  logout: 'users/logout',
  verifyOTP: 'users/otp-verification',
  resendOTP: 'users/otp-resend'
};
export const theatersEndPoints: TheaterEndpoint = {

  signup: 'theaters/signup',
  login: 'theaters/login',
  logout: 'theaters/logout',
  verifyOTP: 'theaters/otp-verification',
  resendOTP: 'theaters/otp-resend'
};

export const adminEndpoints: AdminEndpoint = {
  login: '/admin/login',
  logout: '/admin/logout',
}

