import { serverInstance } from '../../services'
import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit'
import { UserSingUpData } from '../../interface/user/IUserData'
import { userEndPoints } from '../../services/endpoints/endPoints'
import { AxiosError } from 'axios'
import { LoginData, OTPVerification, ResponseData } from '../../interface/Interface'

export const signUpUser: AsyncThunk<any, UserSingUpData, any> = createAsyncThunk(
  'user/singup',
  async (userData: UserSingUpData, { rejectWithValue }) => {
    console.log('reaching the signup async thunk')
    try {
      const response = await serverInstance.post(userEndPoints.signup, userData);
      console.log('response from thunk middle ware', response)
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

export const loginUser: AsyncThunk<any, LoginData, any> = createAsyncThunk(
  'users/login',
  async (userData: LoginData, { rejectWithValue }) => {
    console.log('reaching the login asyncthunk')
    try {
      const response = await serverInstance.post(userEndPoints.login, userData);
      console.log('response received in the login async thunk ', response);
      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data)
      }

      return rejectWithValue('An unknown error occurred')
    }
  }
)

export const verifyUser: AsyncThunk<any, OTPVerification, any> = createAsyncThunk(
  'user/otp-verification',
  async (otpData: OTPVerification, { rejectWithValue }) => {
    console.log('reaching the otp verification async thunk')
    try {
      const response = await serverInstance.post(userEndPoints.verifyOTP, otpData);
      console.log('response received in the login async thunk ', response);
      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('an unknown error occurred')
    }
  }
);

export const logoutUser = createAsyncThunk<ResponseData, void, { rejectValue: string }>(
  'user/logout',
  async (_:void, { rejectWithValue }) => {
    console.log('Reached the logout async thunk');
    try {
      const response = await serverInstance.post(userEndPoints.logout, {});
      console.log('Response received in the logout async thunk: ', response);
      return response.data as ResponseData;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

