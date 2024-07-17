import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { LoginData, ResponseData } from "../../interface/Interface";
import { isErrorResponse } from "../../utils/customError";
import { AxiosError } from "axios";
import { serverInstance } from "../../services";
import { adminEndpoints } from "../../services/endpoints/endPoints";

export const loginAdmin: AsyncThunk<ResponseData, LoginData, {}> = createAsyncThunk(
  'admin/login',
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      const response = await serverInstance.post(adminEndpoints.login, loginData);
      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data,'rejetionvalue')
        return rejectWithValue(error.response?.data)
      }

      return rejectWithValue('an unknown error')
    }
  }
);

export const logoutAdmin = createAsyncThunk<ResponseData, void, {}>(
  'admin/logout',
  async (_: void, { rejectWithValue }) => {

    try {
      const response = await serverInstance.post(adminEndpoints.logout, {});

      return response.data as ResponseData;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);
