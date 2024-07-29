import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { serverInstance } from "../../services";
import { theatersEndPoints } from "../../services/endpoints/endPoints";
import { TheaterSignUpData } from "../../interface/theater/ITheatersData";
import { LoginData, OTPVerification, ResponseData } from "../../interface/Interface";
import { ITheaterDetailResponse } from "../../interface/theater/ITheaterDetail";
interface UpdateTheaterInput {
  theater_name: string,
  theater_license: string,
  city: string,
  address: string,
  images: string[]
}

export const signupTheaters: AsyncThunk<ResponseData, TheaterSignUpData, {}> = createAsyncThunk(
  'theaters/signup',
  async (userData: TheaterSignUpData, { rejectWithValue }) => {
    console.log('reaching the theaterssignup async thunk')
    try {
      const response = await serverInstance.post(theatersEndPoints.signup, userData);
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

export const loginTheaters: AsyncThunk<ResponseData, LoginData, {}> = createAsyncThunk(
  'theaters/login',
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      const response = await serverInstance.post(theatersEndPoints.login, loginData)

      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('an unknown error')
    }
  }
)

export const verifyOTPTheaters: AsyncThunk<ResponseData, OTPVerification, {}> = createAsyncThunk(
  'theaters/otp-verification',
  async (otpData: OTPVerification, { rejectWithValue }) => {
    try {
      const response = await serverInstance.post(theatersEndPoints.verifyOTP, otpData)

      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data)
      }
      console.log('unknown theater otp verification error : ', error)
      return rejectWithValue('an unknown error')
    }
  }
)
export const logoutTheaters = createAsyncThunk<ResponseData, void, {}>(
  'theaters/logout',
  async (_: void, { rejectWithValue }) => {

    try {
      const response = await serverInstance.post(theatersEndPoints.logout, {});

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
      const response = await serverInstance.post(theatersEndPoints.forgotPassword, formData);
      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('an unknown error occured')
    }
  }
)

export const resetPasswordTheaters: AsyncThunk<ResponseData, Record<string, string>, {}> = createAsyncThunk(
  '/theaters/resetPassword',
  async ({ password, token }, { rejectWithValue }) => {
    try {
      const response = await serverInstance.put(theatersEndPoints.resetPassword(token), { password });
      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('an unknown error occured')
    }
  }
)
export const resendOTPTheaters: AsyncThunk<ResponseData, string, {}> = createAsyncThunk(
  '/theaters/resendOTP',
  async (email, { rejectWithValue }) => {
    try {
      const response = await serverInstance.post(theatersEndPoints.resendOTP, { email });
      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('an unknown error occured')
    }
  }
)

export const getTheaterDetails: AsyncThunk<ITheaterDetailResponse, void, {}> = createAsyncThunk(
  'theaters/theater',
  async (_: void, { rejectWithValue }) => {

    try {
      const response = await serverInstance.get(theatersEndPoints.getTheaterDetails, {})
      const { theater } = response?.data?.data
      return await theater
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response)
      }
      return rejectWithValue('an unknown error')
    }
  }

);

export const updateTheater: AsyncThunk<ITheaterDetailResponse, UpdateTheaterInput, {}> = createAsyncThunk(
  'theaters/updateTheater',
  async (theaterData: UpdateTheaterInput, { rejectWithValue }) => {
    try {
      const response = await serverInstance.put(theatersEndPoints.updateTheater, theaterData);
      const { theater } = response.data?.data
      return await theater
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response)
      }
      return rejectWithValue('an unknown error')
    }
  }
)

