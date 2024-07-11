import { serverInstance } from '../../services'
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit'
import { UserSingUpData } from '../../interface/user/IUserData'
import { userEndPoints } from '../../services/endpoints/endPoints'
import { AxiosError } from 'axios'
import { LoginData, OTPVerification, ResponseData } from '../../interface/Interface'
import { ErrorResponse, isErrorResponse } from '../../utils/customError'

export const signUpUser: AsyncThunk<ResponseData, UserSingUpData, {}> = createAsyncThunk(
  'user/singup',
  async (userData: UserSingUpData, { rejectWithValue }) => {
    console.log('reaching the signup async thunk')
    try {
      const response = await serverInstance.post(userEndPoints.signup, userData);
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

export const loginUser: AsyncThunk<ResponseData, LoginData, {}> = createAsyncThunk(
  'users/login',
  async (userData: LoginData, { rejectWithValue }) => {

    try {
      const response = await serverInstance.post(userEndPoints.login, userData);
      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
       
        return rejectWithValue(error.response?.data )
      }

      return rejectWithValue('An unknown error occurred')
    }
  }
)

export const verifyUser: AsyncThunk<ResponseData, OTPVerification, {}> = createAsyncThunk(
  'user/otp-verification',
  async (otpData: OTPVerification, { rejectWithValue }) => {

    try {
      const response = await serverInstance.post(userEndPoints.verifyOTP, otpData);

      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('an unknown error occurred')
    }
  }
);

export const logoutUser = createAsyncThunk<ResponseData, void, {}>(
  'user/logout',
  async (_: void, { rejectWithValue }) => {

    try {
      const response = await serverInstance.post(userEndPoints.logout, {});

      return response.data as ResponseData;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

