import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { IGetTheaterOwnersCount, IGetUserCount, IMovie, IStreamingMovieData, IStreamPlanFilter, IStreamRentalPlan, ITheaterMovieData, LoginData, MovieResponse, MovieType, ResponseData, ResponseData2, RevenueFilter, Role } from "../../interface/Interface";
import { AxiosError } from "axios";
import { serverAdmin } from "../../services";
import { adminEndpoints } from "../../services/endpoints/endPoints";
import { handleAxiosError } from "../../utils/customError";
import { ITheaterOwnerEntity } from "../../interface/theater/ITheaterOwner";
import { IUser } from "../../interface/user/IUserData";
import { IRevenueResponseData } from "./theaterAction";

export const loginAdmin: AsyncThunk<ResponseData, LoginData, {}> = createAsyncThunk(
  'admin/login',
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      const response = await serverAdmin.post(adminEndpoints.login, loginData);
      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {

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
      const response = await serverAdmin.post(adminEndpoints.logout, {});

      return response.data as ResponseData;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
);


export interface EntityResponse {
  maxPage: number,
  data: Partial<ITheaterOwnerEntity>[] | Partial<IUser>[];
}

interface IGetEntityDataForAdmin extends ResponseData2 {
  data: {
    [Role.theaters]?: EntityResponse
    [Role.users]?: EntityResponse
  }
}

export const getEntityDataForAdmin: AsyncThunk<IGetEntityDataForAdmin, { role: Role, pageNumber?: number }, {}> = createAsyncThunk(
  'admin/theaters',
  async ({ role, pageNumber }, { rejectWithValue }) => {
    try {
      const response = await serverAdmin.get(adminEndpoints.getEntityData(role, pageNumber), {});
      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('An Unknown error occurred')
    }
  }
)

export const manageEntitiesByAdmin: AsyncThunk<ResponseData, Record<string, string>, {}> = createAsyncThunk(
  'admin/manageEntities',
  async ({ role, _id }, { rejectWithValue }) => {
    try {
      const response = await serverAdmin.patch(adminEndpoints.manageEntities(_id, role), {});
      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('an unknown error')
    }
  }
)
export const updateTheaterApprovalForAdmin: AsyncThunk<ResponseData, { _id: string, approval_status: string }, {}> = createAsyncThunk(
  'admin/updateTheaterApprovalStatus',
  async ({ _id, approval_status }, { rejectWithValue }) => {
    try {
      const response = await serverAdmin.patch(adminEndpoints.updateApprovalStatus(_id), { approval_status })
      return await response.data
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('An unknown error occurred')
    }

  }
);


export interface IGetMovieResponse extends ResponseData2 {
  data: MovieResponse
}

export const getMovie: AsyncThunk<IGetMovieResponse, { movieType: MovieType, pageNumber?: number }, {}> = createAsyncThunk(
  'admin/getStreamingMovieResponse',
  async ({ movieType, pageNumber }, { rejectWithValue }) => {
    try {

      const response = await serverAdmin.get(adminEndpoints.getMovie(movieType, pageNumber), {});
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }

);

export interface IStreamingMovieResponse {
  maxPageNumber: number,
  movies: IStreamingMovieData[]
}
export const getStreamingMovies: AsyncThunk<IStreamingMovieResponse, { movieType: MovieType, pageNumber?: number }, {}> = createAsyncThunk(
  'admin/getMovie',
  async ({ movieType, pageNumber }, { rejectWithValue }) => {
    try {

      const response = await serverAdmin.get(adminEndpoints.getMovie(movieType, pageNumber), {});
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }

);
interface IMovieResponse extends ResponseData2 {
  data: { movie: ITheaterMovieData | IStreamingMovieData }
}

export const addMovie: AsyncThunk<IMovieResponse, { movieData: IMovie; movieType: MovieType }, {}> = createAsyncThunk(
  'admin/addMovie',
  async ({ movieData, movieType }, { rejectWithValue }) => {
    try {


      const response = await serverAdmin.post(adminEndpoints.addMovie(movieType), movieData,
        {
          headers: {
            ...(movieType === MovieType.stream && { "Content-Type": 'multipart/form-data' })
          }
        });

      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)
export const updateMovie: AsyncThunk<IMovieResponse, { payload: IMovie, movieType: MovieType, movieId: string }, {}> = createAsyncThunk(
  'admin/updateMovie',
  async ({ payload, movieType, movieId }, { rejectWithValue }) => {
    try {
      const response = await serverAdmin.put(adminEndpoints.updateMovie(movieType, movieId), { payload });
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)


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
      const response = await serverAdmin.patch(adminEndpoints.deleteMovie(movieType, movieId), {})

      return await response.data

    } catch (error) {

      if (error instanceof AxiosError) {
        return rejectWithValue(error.response)
      }

      return rejectWithValue('an unknown error')
    }
  }
)

/********************************************************************
*                            Steam Plan                             *
*********************************************************************/

interface IAddStreamPlanResponse extends ResponseData2 {
  data: IStreamRentalPlan
}

interface IGetStreamPlanResponse extends ResponseData2 {
  data: {
    maxPage: number;
    data: IStreamRentalPlan[]
  }
}

export const addStreamPlan: AsyncThunk<IAddStreamPlanResponse, Omit<IStreamRentalPlan, 'listed' | '_id'>, {}> = createAsyncThunk(
  '/admin/addStreamPlan',
  async (data, { rejectWithValue }) => {
    try {
      const response = await serverAdmin.post(adminEndpoints.streamPlan(), data)
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)
export const editStreamPlan: AsyncThunk<IAddStreamPlanResponse, { planId: string, data: Omit<IStreamRentalPlan, 'listed' | '_id'> }, {}> = createAsyncThunk(
  '/admin/editStreamPlan',
  async ({ planId, data }, { rejectWithValue }) => {
    try {
      const response = await serverAdmin.put(adminEndpoints.streamPlan(planId), data)
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)
export const getStreamPlan: AsyncThunk<IGetStreamPlanResponse, { filter?: Partial<IStreamPlanFilter | null> }, {}> = createAsyncThunk(
  '/admin/getStreamPlan',
  async ({ filter }, { rejectWithValue }) => {
    try {

      const response = await serverAdmin.get(adminEndpoints.streamPlan(), { params: { ...filter } })

      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)
export const deleteStreamPlan: AsyncThunk<ResponseData2, string, {}> = createAsyncThunk(
  '/admin/deleteStreamPlan',
  async (planId, { rejectWithValue }) => {
    try {

      const response = await serverAdmin.patch(adminEndpoints.streamPlan(planId))
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)





interface IAdminGetEntityStatResponse extends ResponseData2 {
  data: {
    userStat: IGetUserCount,
    theaterStat: IGetTheaterOwnersCount,
  }
}

export const adminGetEntityStat: AsyncThunk<IAdminGetEntityStatResponse, void, {}> = createAsyncThunk(
  '/admin/adminGetEntityStat',
  async (_, { rejectWithValue }) => {
    try {
      const response = await serverAdmin.get(adminEndpoints.adminGetEntityStat)
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)

export const getAdminStreamRevenue: AsyncThunk<IRevenueResponseData, RevenueFilter, {}> = createAsyncThunk(
  '/theater/getAdminStreamRevenue',
  async (filter, { rejectWithValue }) => {
    try {
      const response = await serverAdmin.get(adminEndpoints.adminStreamRevenue, { params: { ...filter } })
      return response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)