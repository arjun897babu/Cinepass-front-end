import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { serverInstance } from "../../services";
import { theatersEndPoints } from "../../services/endpoints/endPoints";
import { TheaterSignUpData } from "../../interface/theater/ITheatersData";
import { LoginData, OTPVerification, ResponseData } from "../../interface/Interface";


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