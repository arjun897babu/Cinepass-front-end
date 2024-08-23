import { serverUser } from '../../services'
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit'
import { IUser, LoggedOwner, UserSignUpData } from '../../interface/user/IUserData'
import { userEndPoints } from '../../services/endpoints/endPoints'
import { Axios, AxiosError, AxiosResponse } from 'axios'
import { GoogleSignUp, IGetMovieShowResponse, IMovie, LoginData, OTPVerification, ResponseData, ResponseData2 } from '../../interface/Interface'
import { handleAxiosError, IResponseError, isResponseError } from '../../utils/customError'
import { ErrorResponse } from 'react-router-dom'

export const signUpUser: AsyncThunk<ResponseData, UserSignUpData, {}> = createAsyncThunk(
  'user/signup',
  async (userData: UserSignUpData, { rejectWithValue }) => {
    console.log('reaching the signup async thunk')
    try {
      const response = await serverUser.post(userEndPoints.signup, userData);
      console.log('response from thunk middle ware', response);
      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data)
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const getAllCities: AsyncThunk<string[], void, {}> = createAsyncThunk(
  'user/getCities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await serverUser.get(userEndPoints.getAllCities, {});

      const { cities } = response.data?.data
      return await cities
    } catch (error) {
      if (error instanceof AxiosError) {

        return rejectWithValue(error.response);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);
interface userLoginResponse extends ResponseData2{
  data:{user:LoggedOwner}
}
export const loginUser: AsyncThunk<userLoginResponse, LoginData, {}> = createAsyncThunk(
  'users/login',
  async (userData: LoginData, { rejectWithValue }) => {

    try {
      const response = await serverUser.post(userEndPoints.login, userData);
      return await response.data
    } catch (error) { 
      return rejectWithValue(handleAxiosError(error))
    }
  }
)

export const verifyUser: AsyncThunk<ResponseData, OTPVerification, {}> = createAsyncThunk(
  'user/otp-verification',
  async (otpData: OTPVerification, { rejectWithValue }) => {

    try {
      const response = await serverUser.post(userEndPoints.verifyOTP, otpData);

      return await response.data
    } catch (error) {
      
      return rejectWithValue(handleAxiosError(error))
    }
  }
);

export const logoutUser = createAsyncThunk<ResponseData, void, {}>(
  'user/logout',
  async (_: void, { rejectWithValue }) => {

    try {
      const response = await serverUser.post(userEndPoints.logout, {});

      return response.data as ResponseData;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);
 
export const forgotPasswordUser: AsyncThunk<ResponseData, Record<string, string>, {}> = createAsyncThunk(
  '/user/forgot-password',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await serverUser.post(userEndPoints.forgotPassword, formData);
      return await response.data
    } catch (error) {

      return rejectWithValue(handleAxiosError(error))
    }
  }
)

export const resetPassword: AsyncThunk<ResponseData2, Record<string, string>, {}> = createAsyncThunk(
  '/user/resetPassword',
  async ({ password, token }, { rejectWithValue }) => {
    try {
      const response = await serverUser.patch(userEndPoints.resetPassword(token), { password });
      return await response.data
    } catch (error) {
       
      return rejectWithValue(handleAxiosError(error))
    }
  }
);

export const resendOTPUser: AsyncThunk<ResponseData2, string, {}> = createAsyncThunk(
  '/user/resendOTP',
  async (email, { rejectWithValue }) => {
    try {
      const response = await serverUser.post(userEndPoints.resendOTP, { email });
      return await response.data
    } catch (error) {
     
      return rejectWithValue(handleAxiosError(error))
    }
  }
);


interface GoogleAuthResponse extends ResponseData2{
  data:{user:LoggedOwner}
}
export const googleSignUp: AsyncThunk<GoogleAuthResponse, GoogleSignUp, {}> = createAsyncThunk(
  '/user/googleSignUp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await serverUser.post(userEndPoints.googleSignUp, data);
      console.log(response)
      return await response.data
    } catch (error) {
      console.log(error)
      return rejectWithValue(handleAxiosError(error))
    }
  }
);

export const getAllShows: AsyncThunk<IGetMovieShowResponse[], string, {}> = createAsyncThunk(
  '/user/getAllShows',
  async (city, { rejectWithValue }) => {
    try {
      const response = await serverUser.get(userEndPoints.getMovieShows(city), {});
      const { shows } = response.data?.data
      return await shows
    } catch (error) {
     
      return rejectWithValue(handleAxiosError(error))
    }
  }
);
export const getAllMovies: AsyncThunk<IMovie[], string, {}> = createAsyncThunk(
  '/user/getAllMovies',
  async (city, { rejectWithValue }) => {
    try {
      const response = await serverUser.get(userEndPoints.getAllMovies(city), {});
      const { movies } = response.data?.data
      return await movies
    } catch (error) {

      const errorPayload = handleAxiosError(error)
      return rejectWithValue(errorPayload)

    }
  }
);
export const getSingleMovie: AsyncThunk<any[], { city: string, movieId: string }, {}> = createAsyncThunk(
  '/user/getAllMovies',
  async ({ city, movieId }, { rejectWithValue }) => {
    try {
      const response = await serverUser.get(userEndPoints.getSingleMovie(city, movieId), {});
      const { movies } = response.data?.data
      return await movies
    } catch (error) {
      const errorPayload = handleAxiosError(error)
      return rejectWithValue(errorPayload)
    }
  }
);





