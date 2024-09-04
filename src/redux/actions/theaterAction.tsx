import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { serverTheater } from "../../services";
import { theatersEndPoints } from "../../services/endpoints/endPoints";
import { TheaterSignUpData } from "../../interface/theater/ITheatersData";
import { IGetMovieShowResponse, IMovie, LoginData, OTPVerification, ResponseData, ResponseData2 } from "../../interface/Interface";

import { ITheaterScreen, ITheaterScreenResponse } from "../../interface/theater/ITheaterScreen";
import { MovieType } from "../../component/admin/MovieForm";
import { IMovieShow } from "../../interface/theater/IMovieShow";
import { handleAxiosError } from "../../utils/customError";
import { ITheaterOwnerEntity, TheaterOwnerProfile, TheaterProfile } from "../../interface/theater/ITheaterOwner";

/*..................auth.................. */

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

      return rejectWithValue(handleAxiosError(error))
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

/*..................auth.................. */

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

export const updateTheater: AsyncThunk<IUpdateTheaterData, (TheaterOwnerProfile | Partial<TheaterProfile>), {}> = createAsyncThunk(
  'theaters/updateTheater',
  async (theaterData , { rejectWithValue }) => {
    try {
      const response = await serverTheater.put(theatersEndPoints.updateTheater, theaterData);
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)


/*..................screen.................. */


export const getScreen: AsyncThunk<ITheaterScreenResponse[], string | undefined, {}> = createAsyncThunk(
  'theaters/getScreen',
  async (amenity, { rejectWithValue }) => {
    try {

      const response = await serverTheater.get(theatersEndPoints.getScreen(amenity), {});
      const { screens } = response.data?.data

      return await screens
    } catch (error) {

      return rejectWithValue(handleAxiosError(error))


    }
  }

)
interface TheaterScreenResponse extends ResponseData2 {
  data: { screen: ITheaterScreenResponse }
}
export const createTheaterScreen: AsyncThunk<TheaterScreenResponse, ITheaterScreen, {}> = createAsyncThunk(
  'theaters/add-screen',
  async (theaterScreenData: ITheaterScreen, { rejectWithValue }) => {
    console.log('create theater screen is called');
    try {
      const response = await serverTheater.post(theatersEndPoints.createScreen, theaterScreenData);
      console.log(response)
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)
interface IDeleteScreenResponse extends ResponseData2 {
  data: {
    _id: string,

  }
}
export const deleteTheaterScreen: AsyncThunk<IDeleteScreenResponse, string, {}> = createAsyncThunk(
  '/theaters/deleteScreen',
  async (screenId, { rejectWithValue }) => {
    console.log('delete screen ayscnthunk is being callled')
    try {
      const response = await serverTheater.patch(theatersEndPoints.deleteScreen(screenId), {})
      return response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)

export const updateTheaterScreen: AsyncThunk<TheaterScreenResponse, { screenId: string, payload: ITheaterScreen }, {}> = createAsyncThunk(
  '/theaters/updateScreen',
  async ({ screenId, payload }, { rejectWithValue }) => {
    console.log('update screen ayscnthunk is being callled');
    console.log(payload)
    try {
      const response = await serverTheater.put(theatersEndPoints.updateScreen(screenId), { payload })
      return response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)
/*..................screen.................. */

/*..................movie.................. */
export const getMovie: AsyncThunk<IMovie[], MovieType, {}> = createAsyncThunk(
  'theaters/getMovie',
  async (movieType: MovieType, { rejectWithValue }) => {
    try {
      console.log('calleed')
      const response = await serverTheater.get(theatersEndPoints.getMovie(movieType), {});
      console.log(response)
      const { movies } = response.data?.data
      return await movies
    } catch (error) {
      console.log(error)
      return rejectWithValue(handleAxiosError(error))
    }
  }

)
/*..................movie.................. */

/*..................show.................. */

export const getAllShows: AsyncThunk<IGetMovieShowResponse[], void, {}> = createAsyncThunk(
  '/theaters/getAllShows',
  async (_, { rejectWithValue }) => {
    try {
      console.log('getshow asyncthunk is called')
      const response = await serverTheater.get(theatersEndPoints.getMovieShows, {});
      const { shows } = response.data?.data
      return await shows
    } catch (error) {

      return rejectWithValue(handleAxiosError(error))
    }
  }
);
interface addMovieShowResponse extends ResponseData2 {
  data: {
    show: IMovieShow
  }
}
export const addMovieShows: AsyncThunk<addMovieShowResponse, IMovieShow, {}> = createAsyncThunk(
  'theaters/addMovieShows',
  async (formData, { rejectWithValue }) => {
    try {
      console.log('add movieshow async thunk is called')
      const response = await serverTheater.post(theatersEndPoints.addMovieShows, formData);
      console.log(response)
      return await response.data
    } catch (error) {
      console.log(error)
      return rejectWithValue(handleAxiosError(error))
    }
  }

)

export const updateMovieShow: AsyncThunk<ResponseData2, { payload: IMovieShow, showId: string }, {}> = createAsyncThunk(
  '/theaters/updateShows',
  async ({ payload, showId }, { rejectWithValue }) => {
    console.log('update show asyncthunk is called')
    try {

      const respones = await serverTheater.put(theatersEndPoints.updateMovieShow(showId), { payload })
      console.log(respones)
      return respones.data
    } catch (error) {
      console.log(error)
      return rejectWithValue(handleAxiosError(error))
    }
  }
);

export const deleteMovieShow: AsyncThunk<ResponseData2, string, {}> = createAsyncThunk(
  '/theaters/deleteShows',
  async (showId, { rejectWithValue }) => {
    console.log('delete show asyncthunk is called')
    try {
      const respones = await serverTheater.patch(theatersEndPoints.delteMovieShow(showId), {})
      console.log(respones)
      return respones.data
    } catch (error) {
      console.log(error)
      return rejectWithValue(handleAxiosError(error))
    }
  }
)
/*..................show.................. */