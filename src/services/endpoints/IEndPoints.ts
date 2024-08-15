import { MovieType } from "../../component/admin/MovieForm";

export interface IEndPoints {
  login: string;
  logout: string;
}

export interface UserEndpoint extends IEndPoints {
  signup: string;
  verifyOTP: string;
  resendOTP: string;
  forgotPassword: string;
  resetPassword: (token: string) => string;
  googleSignUp: string;
  googleLogout: string;
  getMovieShows: (city: string) => string
  getAllCities: string
  getAllMovies: (city: string) => string
  getSingleMovie: (city: string, movieId: string) => string
}
export interface TheaterEndpoint extends IEndPoints {
  signup: string;
  verifyOTP: string;
  resendOTP: string;
  forgotPassword: string;
  resetPassword: (token: string) => string;
  getTheaterDetails: string;
  updateTheater: string
  createScreen: string
  getMovie: (movieType: MovieType) => string
  getScreen: string
  addMovieShows: string
  getMovieShows: string
}
export interface AdminEndpoint extends IEndPoints {
  getEntityData: (role: string) => string
  updateApprovalStatus: (theaterOwnerId: string) => string
  manageEntities: (_entityId: string, role: string) => string
  addMovie: (movieType: MovieType) => string
  getMovie: (movieType: MovieType) => string
  deleteMovie: (movieTpe: MovieType, movieId: string) => string

}