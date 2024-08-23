import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { serverTheater } from "../../services";
import { theatersEndPoints } from "../../services/endpoints/endPoints";
import { TheaterSignUpData } from "../../interface/theater/ITheatersData";
import { IGetMovieShowResponse, IMovie, LoginData, OTPVerification, ResponseData, ResponseData2 } from "../../interface/Interface";

import { ITheaterScreen, ITheaterScreenResponse } from "../../interface/theater/ITheaterScreen";
import { MovieType } from "../../component/admin/MovieForm";
import { IMovieShow } from "../../interface/theater/IMovieShow";
import { handleAxiosError, IResponseError } from "../../utils/customError";
import { ITheaterOwnerEntity, TheaterOwnerProfile, TheaterProfile } from "../../interface/theater/ITheaterOwner";



export const signupTheaters: AsyncThunk<ResponseData, TheaterSignUpData, {}> = createAsyncThunk(
  'theaters/signup',
  async (userData: TheaterSignUpData, { rejectWithValue }) => {
    console.log('reaching the theaterssignup async thunk')
    try {
      const response = await serverTheater.post(theatersEndPoints.signup, userData);
       return await response.data
    } catch (error) {
      
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

export const loginTheaters: AsyncThunk<ResponseData, LoginData, {}> = createAsyncThunk(
  'theaters/login',
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      const response = await serverTheater.post(theatersEndPoints.login, loginData)

      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('an unknown error')
    }
  }
)

export const verifyOTPTheaters: AsyncThunk<ResponseData2, OTPVerification, {}> = createAsyncThunk(
  'theaters/otp-verification',
  async (otpData: OTPVerification, { rejectWithValue }) => {
    try {
      const response = await serverTheater.post(theatersEndPoints.verifyOTP, otpData)

      return await response.data
    } catch (error) {

      return rejectWithValue(handleAxiosError(error))
    }
  }
)
export const logoutTheaters = createAsyncThunk<ResponseData, void, {}>(
  'theaters/logout',
  async (_: void, { rejectWithValue }) => {

    try {
      const response = await serverTheater.post(theatersEndPoints.logout, {});

      return response.data as ResponseData;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const forgotPasswordTheaters: AsyncThunk<ResponseData, Record<string, string>, {}> = createAsyncThunk(
  '/theaters/forgot-password',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await serverTheater.post(theatersEndPoints.forgotPassword, formData);
      console.log(response)
      return await response.data
    } catch (error) {

      console.log(error)
      return rejectWithValue(handleAxiosError(error))
    }
  }
)

export const resetPasswordTheaters: AsyncThunk<ResponseData, Record<string, string>, {}> = createAsyncThunk(
  '/theaters/resetPassword',
  async ({ password, token }, { rejectWithValue }) => {
    try {
      const response = await serverTheater.put(theatersEndPoints.resetPassword(token), { password });
      return await response.data
    } catch (error) {

      return rejectWithValue(handleAxiosError(error))
    }
  }
)
export const resendOTPTheaters: AsyncThunk<ResponseData, string, {}> = createAsyncThunk(
  '/theaters/resendOTP',
  async (email, { rejectWithValue }) => {
    try {
      const response = await serverTheater.post(theatersEndPoints.resendOTP, { email });
      return await response.data
    } catch (error) {

      return rejectWithValue(handleAxiosError(error))
    }
  }
)

export const getTheaterDetails: AsyncThunk<ITheaterOwnerEntity, void, {}> = createAsyncThunk(
  'theaters/theater',
  async (_: void, { rejectWithValue }) => {

    try {
      const response = await serverTheater.get(theatersEndPoints.getTheaterDetails, {})
      const { theater } = response?.data?.data
      return await theater
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }

);

interface IUpdateTheaterData extends ResponseData2 {
  data: {
    theater: ITheaterOwnerEntity;
  }
}

export const updateTheater: AsyncThunk<IUpdateTheaterData, (TheaterOwnerProfile | TheaterProfile), {}> = createAsyncThunk(
  'theaters/updateTheater',
  async (theaterData: TheaterOwnerProfile | TheaterProfile, { rejectWithValue }) => {
    try {
      const response = await serverTheater.put(theatersEndPoints.updateTheater, theaterData);
      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        const { response } = error
        if (response) {
          return rejectWithValue({
            statusCode: response.status,
            data: response.data.error
          } as IResponseError);
        }
      }
      return rejectWithValue({
        statusCode: 500,
        data: {
          error: 'unknown_error',
          message: 'an unknown error occured'
        }
      } as IResponseError)
    }
  }
)

export const createTheaterScreen: AsyncThunk<ITheaterScreenResponse, ITheaterScreen, {}> = createAsyncThunk(
  'theaters/add-screen',
  async (theaterScreenData: ITheaterScreen, { rejectWithValue }) => {
    try {
      const response = await serverTheater.post(theatersEndPoints.createScreen, theaterScreenData);

      const { screen } = response.data?.data

      return await screen

    } catch (error) {

      if (error instanceof AxiosError) {
        const { response } = error
        if (response) {
          return rejectWithValue({
            statusCode: response.status,
            data: response.data.error
          } as IResponseError);
        }
      }

      return rejectWithValue({
        statusCode: 500,
        data: {
          error: 'unknown_error',
          message: 'an unknown error occured'
        }
      } as IResponseError)
    }
  }
)

export const getMovie: AsyncThunk<IMovie[], MovieType, {}> = createAsyncThunk(
  'theaters/getMovie',
  async (movieType: MovieType, { rejectWithValue }) => {
    try {

      const response = await serverTheater.get(theatersEndPoints.getMovie(movieType), {});
      const { movies } = response.data?.data
      return await movies
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response)
      }

      return rejectWithValue('an unknown error')
    }
  }

)
export const getScreen: AsyncThunk<ITheaterScreenResponse[], void, {}> = createAsyncThunk(
  'theaters/getScreen',
  async (_, { rejectWithValue }) => {
    try {

      const response = await serverTheater.get(theatersEndPoints.getScreen, {});
      const { screens } = response.data?.data

      return await screens
    } catch (error) {

      return rejectWithValue(handleAxiosError(error))


    }
  }

)

interface addMovieShowResponse extends ResponseData2 {
  data: {
    show: IMovieShow
  }
}
export const addMovieShows: AsyncThunk<addMovieShowResponse, IMovieShow, {}> = createAsyncThunk(
  'theaters/addMovieShows',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await serverTheater.post(theatersEndPoints.addMovieShows, formData);

      return await response.data
    } catch (error) {
       
      return rejectWithValue(handleAxiosError(error) )
    }
  }

)


export const getAllShows: AsyncThunk<IGetMovieShowResponse[], void, {}> = createAsyncThunk(
  '/theaters/getAllShows',
  async (_, { rejectWithValue }) => {
    try {
      const response = await serverTheater.get(theatersEndPoints.getMovieShows, {});
      const { shows } = response.data?.data
      return await shows
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response)
      }
      return rejectWithValue('an unknown error occured')
    }
  }
);