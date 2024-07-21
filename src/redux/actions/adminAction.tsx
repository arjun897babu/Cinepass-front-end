import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { LoginData, ResponseData } from "../../interface/Interface";
import { AxiosError, AxiosHeaders } from "axios";
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
        console.log(error.response?.data, 'rejetionvalue')
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

export const getEntityDataForAdmin: AsyncThunk<ResponseData, string, {}> = createAsyncThunk(
  'admin/theaters',
  async (role: string, { rejectWithValue }) => {
    try {
      const response = await serverInstance.get(adminEndpoints.getEntityData(role), {});
      return response.data as ResponseData
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('An Unknown error occurred')
    }
  }
)

export const updateTheaterApprovalForAdmin: AsyncThunk<ResponseData, Record<string, string>, {}> = createAsyncThunk(
  'admin/updateTheaterApprovalStatus',
  async ({ theaterOwnerId, approval_status }, { rejectWithValue }) => {
    try {
      const response = await serverInstance.put(adminEndpoints.updateApprovalStatus(theaterOwnerId), { approval_status })
      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('An unknown error occured')
    }

  }
);

export const manageEntitiesByAdmin: AsyncThunk<ResponseData, Record<string, string>, {}> = createAsyncThunk(
  'admin/manageEntities',
  async ({ role, _id }, { rejectWithValue }) => {
    try {
      const response = await serverInstance.put(adminEndpoints.manageEntities(_id, role), {});
      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('an unknown error')
    }
  }
)


