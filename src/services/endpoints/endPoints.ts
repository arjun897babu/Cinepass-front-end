import { UserEndpoint, AdminEndpoint, TheaterEndpoint } from "./IEndPoints";

export const userEndPoints: UserEndpoint = {

  signup: '/signup',
  login: '/login',
  logout: '/logout',
  verifyOTP: '/otp-verification',
  resendOTP: '/resend-otp',
  forgotPassword: '/forgot-password',
  resetPassword: (token: string) => `/reset-password/${token}`,
  googleSignUp: '/google-signup',
  googleLogout: 'users/google-logout',
  getMovieShows: (city) => `/get-shows/${city}`,
  getAllCities: `/get-cities`,
  getAllMovies: (city) => `/get-movies/${city}`,
  getSingleMovie: (city, movieId) => `/get-movies/${city}?movieId=${movieId}`,
};

export const theatersEndPoints: TheaterEndpoint = {

  signup: '/signup',
  login: '/login',
  logout: '/logout',
  verifyOTP: '/otp-verification',
  resendOTP: '/resend-otp',
  forgotPassword: '/forgot-password',
  resetPassword: (token: string) => `/reset-password/${token}`,
  getTheaterDetails: `/theater`,
  updateTheater: `/update-theater`,
  createScreen: `theaters/add-screen`,
  getMovie: (movieType) => `/get-movie/${movieType}`,
  getScreen: `/get-allScreen`,
  addMovieShows: `/add-shows`,
  getMovieShows: `/get-shows`


};

export const adminEndpoints: AdminEndpoint = {
  login: '/login',
  logout: '/logout',
  getEntityData: (role) => `/${role}`,
  updateApprovalStatus: (theaterOwnerId) => `/approval/${theaterOwnerId}`,
  manageEntities: (entityId, role) => `/manage-status/${role}/${entityId}`,
  addMovie: (movieType) => `/add-movie/${movieType}`,
  getMovie: (movieType) => `admin/get-movie/${movieType}`,
  deleteMovie: (movieTpe, movieId) => `/delete/${movieTpe}/${movieId}`
}