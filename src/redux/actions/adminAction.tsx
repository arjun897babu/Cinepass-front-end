import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { ApprovalStatus, IMovie, LoginData, ResponseData, ResponseData2 } from "../../interface/Interface";
import { AxiosError, AxiosHeaders } from "axios";
import { serverInstance } from "../../services";
import { adminEndpoints } from "../../services/endpoints/endPoints";
import { MovieType } from "../../component/admin/MovieForm";
import { IResponseError } from "../../utils/customError";

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

export const updateTheaterApprovalForAdmin: AsyncThunk<ResponseData, { _id: string, approval_status: string }, {}> = createAsyncThunk(
  'admin/updateTheaterApprovalStatus',
  async ({ _id, approval_status }, { rejectWithValue }) => {
    try {
      const response = await serverInstance.put(adminEndpoints.updateApprovalStatus(_id), { approval_status })
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

export const addMovie: AsyncThunk<IMovie, { movieData: IMovie; movieType: MovieType }, {}> = createAsyncThunk(
  'admin/manageEntities',
  async ({ movieData, movieType }, { rejectWithValue }) => {
    try {
      console.log('this is the moviedata', movieData)
      const response = await serverInstance.post(adminEndpoints.addMovie(movieType), movieData);
      const { movie } = response.data?.data

      return await movie
    } catch (error) {
      if (error instanceof AxiosError) {
        const { response } = error;

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
  'admin/getMovie',
  async (movieType: MovieType, { rejectWithValue }) => {
    try {

      const response = await serverInstance.get(adminEndpoints.getMovie(movieType), {});
      const { movies } = response.data?.data
      return await movies
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response)
      }

      return rejectWithValue('an unknown error')
    }
  }

);


interface IManageMovieResponse extends ResponseData2 {
  data: {
    movie: {
      _id: string,
      status: string
    }
  }
}
export const manageMovie: AsyncThunk<IManageMovieResponse, { movieType: MovieType, movieId: string }, {}> = createAsyncThunk(
  'admin/manageMovie',
  async ({ movieType, movieId }, { rejectWithValue }) => {
    try {
      const response = await serverInstance.patch(adminEndpoints.deleteMovie(movieType, movieId), {})

      return await response.data

    } catch (error) {

      if (error instanceof AxiosError) {
        return rejectWithValue(error.response)
      }

      return rejectWithValue('an unknown error')
    }
  }
)

