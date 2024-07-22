import { UserEndpoint, AdminEndpoint, TheaterEndpoint } from "./IEndPoints";

export const userEndPoints: UserEndpoint = {

  signup: '/users/signup',
  login: '/users/login',
  logout: '/users/logout',
  verifyOTP: '/users/otp-verification',
  resendOTP: '/users/resend-otp',
  forgotPassword: '/users/forgot-password',
  resetPassword: (token: string) => `/users/reset-password/${token}`,
  googleSignUp: '/users/google-signup',
  googleLogout: 'users/google-logout'
};
export const theatersEndPoints: TheaterEndpoint = {

  signup: '/theaters/signup',
  login: '/theaters/login',
  logout: '/theaters/logout',
  verifyOTP: '/theaters/otp-verification',
  resendOTP: '/theaters/resend-otp',
  forgotPassword: '/theaters/forgot-password',
  resetPassword: (token: string) => `/theaters/reset-password/${token}`


};

export const adminEndpoints: AdminEndpoint = {
  login: '/admin/login',
  logout: '/admin/logout',
  getEntityData: (role: string) => `/admin/${role}`,
  updateApprovalStatus: (theaterOwnerId) => `/admin/approval/${theaterOwnerId}`,
  manageEntities: (_id, role) => `/admin/manage-status/${role}/${_id}`
}

