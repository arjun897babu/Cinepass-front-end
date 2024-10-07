import { serverUser } from '../../services'
import { AsyncThunk, createAsyncThunk, isRejectedWithValue } from '@reduxjs/toolkit'
import { IUser, LoggedOwner, UserSignUpData } from '../../interface/user/IUserData'
import { userEndPoints } from '../../services/endpoints/endPoints'
import { AxiosError } from 'axios'
import { BookingStatus, GoogleSignUp, IGetMovieShowResponse, IGetSingleShow, IMovie, IStreamingMovieData, ITicketSummaryLocationState, IUserTicketData, LoginData, MovieFilter, OTPVerification, ResponseData, ResponseData2, TicketFilter } from '../../interface/Interface'
import { handleAxiosError } from '../../utils/customError'
import { ITheaterOwnerEntity, TheaterOwnerProfile } from '../../interface/theater/ITheaterOwner'
import { userResetBookingInfo } from '../reducers/userReducer'

export const signUpUser: AsyncThunk<ResponseData, UserSignUpData, {}> = createAsyncThunk(
  'user/signup',
  async (userData: UserSignUpData, { rejectWithValue }) => {
    console.log('reaching the signup async thunk')
    try {
      const response = await serverUser.post(userEndPoints.signup, userData);
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

export const getAllCities: AsyncThunk<string[], void, {}> = createAsyncThunk(
  'user/getCities',
  async (_, { rejectWithValue }) => {
    try {
      const response = await serverUser.get(userEndPoints.getAllCities, {});

      const { cities } = response.data?.data
      return await cities
    } catch (error) {
      if (error instanceof AxiosError) {

        return rejectWithValue(error.response);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);
interface userLoginResponse extends ResponseData2 {
  data: { user: LoggedOwner }
}
export const loginUser: AsyncThunk<userLoginResponse, LoginData, {}> = createAsyncThunk(
  'users/login',
  async (userData: LoginData, { dispatch, getState, rejectWithValue }) => {

    try {
      const response = await serverUser.post(userEndPoints.login, userData);
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)

export const verifyUser: AsyncThunk<ResponseData, OTPVerification, {}> = createAsyncThunk(
  'user/otp-verification',
  async (otpData: OTPVerification, { rejectWithValue }) => {

    try {
      const response = await serverUser.post(userEndPoints.verifyOTP, otpData);

      return await response.data
    } catch (error) {

      return rejectWithValue(handleAxiosError(error))
    }
  }
);

export const logoutUser = createAsyncThunk<ResponseData, void, {}>(
  'user/logout',
  async (_: void, { rejectWithValue }) => {

    try {
      const response = await serverUser.post(userEndPoints.logout, {});

      return response.data as ResponseData;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

export const forgotPasswordUser: AsyncThunk<ResponseData, Record<string, string>, {}> = createAsyncThunk(
  '/user/forgot-password',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await serverUser.post(userEndPoints.forgotPassword, formData);
      return await response.data
    } catch (error) {

      return rejectWithValue(handleAxiosError(error))
    }
  }
)

export const resetPassword: AsyncThunk<ResponseData2, Record<string, string | undefined>, {}> = createAsyncThunk(
  '/user/resetPassword',
  async ({ password, token }, { rejectWithValue }) => {
    try {
      const response = await serverUser.patch(userEndPoints.resetPassword(token), { password });
      return await response.data
    } catch (error) {

      return rejectWithValue(handleAxiosError(error))
    }
  }
);

export const resendOTPUser: AsyncThunk<ResponseData2, string, {}> = createAsyncThunk(
  '/user/resendOTP',
  async (email, { rejectWithValue }) => {
    try {
      const response = await serverUser.post(userEndPoints.resendOTP, { email });
      return await response.data
    } catch (error) {

      return rejectWithValue(handleAxiosError(error))
    }
  }
);


interface GoogleAuthResponse extends ResponseData2 {
  data: { user: LoggedOwner }
}
export const googleSignUp: AsyncThunk<GoogleAuthResponse, GoogleSignUp, {}> = createAsyncThunk(
  '/user/googleSignUp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await serverUser.post(userEndPoints.googleSignUp, data);
      console.log(response)
      return await response.data
    } catch (error) {
      console.log(error)
      return rejectWithValue(handleAxiosError(error))
    }
  }
);

export const getAllShows: AsyncThunk<any[], { city: string, theaterId: string }, {}> = createAsyncThunk(
  '/user/getAllShows',
  async ({ city, theaterId }, { rejectWithValue }) => {
    try {
      console.log('get all shows for single theater is called')
      const response = await serverUser.get(userEndPoints.getMovieShows(city, theaterId), {});
      const { shows } = response.data?.data
      return await shows
    } catch (error) {

      return rejectWithValue(handleAxiosError(error))
    }
  }
);
export const getAllMovies: AsyncThunk<IMovie[], { city: string, filter?: Partial<MovieFilter> }, {}> = createAsyncThunk(
  '/user/getAllMovies',
  async ({ city, filter }, { rejectWithValue }) => {
    console.log(filter);
    try {
      const response = await serverUser.get(userEndPoints.getAllMovies(city), {
        params: { ...filter }
      });
      const { movies } = response.data?.data
      return await movies
    } catch (error) {
      const errorPayload = handleAxiosError(error)
      return rejectWithValue(errorPayload)
    }
  }
);



export const getSingleMovie: AsyncThunk<any[], { city: string, movieId: string, filter?: Partial<MovieFilter> }, {}> = createAsyncThunk(
  '/user/getSingleMovie',
  async ({ city, movieId, filter }, { rejectWithValue }) => {
    try {
      const response = await serverUser.get(userEndPoints.getSingleMovie(city, movieId), { params: filter });
      console.log(response.data.data)
      const { movies } = response.data?.data
      return await movies
    } catch (error) {
      const errorPayload = handleAxiosError(error)
      return rejectWithValue(errorPayload)
    }
  }
);


interface IGetTheaterByCityResponse extends ResponseData2 {
  data: { theater: Partial<TheaterOwnerProfile>[] }
}
export const getTheatersByCity: AsyncThunk<IGetTheaterByCityResponse, string, {}> = createAsyncThunk(
  '/user/theater',
  async (city, { rejectWithValue }) => {
    console.log('gettheater by city asynthunk is called')
    try {
      const response = await serverUser.get(userEndPoints.getTheater(city), {})
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)

interface IGetUserProfileResponse extends ResponseData2 {
  data: { user: LoggedOwner }
}

export const getUserProfile: AsyncThunk<IGetUserProfileResponse, void, {}> = createAsyncThunk(
  '/user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await serverUser.get(userEndPoints.userProfile, {})
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)

export const updateUserProfile: AsyncThunk<IGetUserProfileResponse, { payload: Partial<IUser> }, {}> = createAsyncThunk(
  '/user/updateUserProfile',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await serverUser.put(userEndPoints.userProfile, payload)
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)

interface IGetSingleShowDetails extends ResponseData2 {
  data: { shows: IGetSingleShow }
}

export const getSingleShowDetails: AsyncThunk<IGetSingleShowDetails, { city: string, showId: string, filter: Partial<MovieFilter> }, {}> = createAsyncThunk(
  '/user/getSingleShowDetails',
  async ({ city, showId, filter }, { rejectWithValue }) => {
    console.log('get single show details asyncthunk is being called')
    try {
      const response = await serverUser.get(userEndPoints.getSingleShow(city), {
        params: {
          showId,
          ...filter
        }
      })
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)

interface SeatBookingPayload {
  bookingDate: string
  reservedSeats: string[]
}

interface BookTicketsResponse extends ResponseData2 {
  data: {
    clientSecret: string
    paymentIntentId: string
  }
}

export const bookTickets: AsyncThunk<BookTicketsResponse, ITicketSummaryLocationState, {}> = createAsyncThunk(
  '/user/seatBooking',
  async ({ showId, bookingDate, selectedSeats }, { rejectWithValue }) => {
    try {


      const response = await serverUser.post(userEndPoints.bookTicket(showId),
        {
          bookingDate,
          reservedSeats: selectedSeats
        }
      )
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)

interface IGetUserTicketResponse extends ResponseData2 {
  data: {
    maxPage: number,
    data: IUserTicketData[]
  }
}

export const getUserTickets: AsyncThunk<IGetUserTicketResponse, { filter?: TicketFilter }, {}> = createAsyncThunk
  (
    '/user/getUserTickets',
    async ({ filter }, { rejectWithValue }) => {
      try {
        const response = await serverUser.get(userEndPoints.getTicket, { params: { ...filter } })
        return await response.data
      } catch (error) {
        return rejectWithValue(handleAxiosError(error))

      }
    }
  )

export const cancelUserPayment: AsyncThunk<ResponseData2, { paymentIntentId: string, }, {}> = createAsyncThunk(
  '/user/cancelUserPayments',
  async ({ paymentIntentId }, { rejectWithValue }) => {
    try {
      const response = await serverUser.post(userEndPoints.cancelPayment(paymentIntentId))
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))

    }
  }
)

interface IGetUserStreamingMovieResponse extends ResponseData2 {
  data: {
    running: IStreamingMovieData[]
    upcoming: IStreamingMovieData[],
  }
}

export const getUserStreamingMovies: AsyncThunk<IGetUserStreamingMovieResponse, void, {}> = createAsyncThunk(
  '/user/getStreamingMovie',
  async (_, { rejectWithValue }) => {
    try {
      const response = await serverUser.get(userEndPoints.getStreamingMovies)
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))

    }
  }
)

interface IGetSingleStreamingMovieResponse extends ResponseData2 {
  data: IStreamingMovieData
}
export const getUserSingleStreamingMovies: AsyncThunk<IGetSingleStreamingMovieResponse, string, {}> = createAsyncThunk(
  '/user/getUserSingleStreamingMovies',
  async (movieId, { rejectWithValue }) => {
    try {
      const response = await serverUser.get(userEndPoints.getSingleStreamingMovie(movieId))
      return await response.data
    } catch (error) {
      return rejectWithValue(handleAxiosError(error))
    }
  }
)


