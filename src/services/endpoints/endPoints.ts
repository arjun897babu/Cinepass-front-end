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
  googleLogout: '/google-logout',
  getMovieShows: (city) => `/shows/${city}`,
  getAllCities: `/cities`,
  getAllMovies: (city) => `/movies/${city}`,
  getSingleMovie: (city, movieId) => `/movies/${city}?movieId=${movieId}`,
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
  updateTheater: `/theater`,
  createScreen: `/screen`,
  getScreen: (amenity) => `/screen?amenity=${amenity}`,
  updateScreen: (screenId) => `/screen/${screenId}`,
  deleteScreen: (screenId) => `/screen/${screenId}`,
  getMovie: (movieType) => `/movie/${movieType}`,
  getMovieShows: `/shows`,
  addMovieShows: `/shows`,
  updateMovieShow: (showId) => `/shows/${showId}`,
  delteMovieShow: (showId) => `/shows/${showId}`,
};

export const adminEndpoints: AdminEndpoint = {
  login: '/login',
  logout: '/logout',
  getEntityData: (role) => `/${role} `,
  updateApprovalStatus: (theaterOwnerId) => `/approval/${theaterOwnerId}`,
  manageEntities: (entityId, role) => `/${role}/${entityId}`,
  addMovie: (movieType) => `/movie/${movieType}`,
  getMovie: (movieType) => `/movie/${movieType}`,
  deleteMovie: (movieTpe, movieId) => `/movie/${movieTpe}/${movieId}`,
  updateMovie: (movieTpe, movieId) => `/movie/${movieTpe}/${movieId}`,
}