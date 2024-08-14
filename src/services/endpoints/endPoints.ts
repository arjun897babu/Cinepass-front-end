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
  googleLogout: 'users/google-logout',
  getMovieShows: (city) => `/users/get-shows/${city}`,
  getAllCities: `/users/get-cities`,
  getAllMovies: (city) => `/users/get-movies/${city}`,
  getSingleMovie: (city, movieId) => `/users/get-movies/${city}?movieId=${movieId}`,
};

export const theatersEndPoints: TheaterEndpoint = {

  signup: '/theaters/signup',
  login: '/theaters/login',
  logout: '/theaters/logout',
  verifyOTP: '/theaters/otp-verification',
  resendOTP: '/theaters/resend-otp',
  forgotPassword: '/theaters/forgot-password',
  resetPassword: (token: string) => `/theaters/reset-password/${token}`,
  getTheaterDetails: `/theaters/theater`,
  updateTheater: `/theaters/update-theater`,
  createScreen: `theaters/add-screen`,
  getMovie: (movieType) => `/theaters/get-movie/${movieType}`,
  getScreen: `/theaters/get-allScreen`,
  addMovieShows: `/theaters/add-shows`,
  getMovieShows: `/theaters/get-shows`


};

export const adminEndpoints: AdminEndpoint = {
  login: '/admin/login',
  logout: '/admin/logout',
  getEntityData: (role: string) => `/admin/${role}`,
  updateApprovalStatus: (theaterOwnerId) => `/admin/approval/${theaterOwnerId}`,
  manageEntities: (entityId, role) => `/admin/manage-status/${role}/${entityId}`,
  addMovie: (movieType) => `/admin/add-movie/${movieType}`,
  getMovie: (movieType) => `admin/get-movie/${movieType}`
}