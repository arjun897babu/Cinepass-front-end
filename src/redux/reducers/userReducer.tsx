import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { forgotPasswordUser, getAllShows, getSingleMovie, googleSignUp, loginUser, logoutUser, resendOTPUser, resetPassword, signUpUser, verifyUser } from "../actions/userAction";
import { IInitialState } from "./IState";
import { IInitialStateError, ResponseData, ResponseStatus } from "../../interface/Interface";
import { isErrorResponse, isResponseError } from "../../utils/customError";
import { LoggedOwner } from "../../interface/user/IUserData";



const initialState: IInitialState = {
  owner: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  tempMail: null,
  isGoogleAuth: false,
  city: undefined

};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userClearError(state) {
      state.error = null;
    },
    userSetError(state, action: PayloadAction<IInitialStateError>) {
      state.error = action.payload
    },
    userSetIsAuthenticated(state) {
      state.isAuthenticated = !state.isAuthenticated
    },
    userSetLoading(state) {
      state.loading = !state.loading
    },
    userSetCity(state, action: PayloadAction<string>) {
      state.city = action.payload
    },
    userClearTempMail(state) {
      state.tempMail = null
    }
  },
  extraReducers: (builder) => {
    builder

      //singup
      .addCase(signUpUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.tempMail = action.payload.data ? action.payload.data as { email: string } : null
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        if (isErrorResponse(action.payload)) {
          state.error = action.payload.error as IInitialStateError | null
        }
      })

      //login
      .addCase(loginUser.pending, (state) => {

        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.error = null
        state.isAuthenticated = true
        state.owner = action.payload.data.user
        state.isGoogleAuth = false
      })
      .addCase(loginUser.rejected, (state, action) => {
        if (isResponseError(action.payload)) {
          if (action.payload.statusCode === 401 && action.payload.data.error === 'otp') {
            state.tempMail = action.payload.data ? action.payload.data.tempMail as {email:string}  : null
          }
        }
      })

      //google login
      .addCase(googleSignUp.pending, (state) => {

        state.error = null
      })
      .addCase(googleSignUp.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null
        state.isAuthenticated = true
        state.owner = action.payload.data.user
        state.isGoogleAuth = true
      })

      //logout
      .addCase(logoutUser.pending, (state) => {

        state.error = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null
        state.isAuthenticated = false;
        state.owner = null
        state.isGoogleAuth = true
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        if (isErrorResponse(action.payload)) {
          state.error = action.payload.error as IInitialStateError | null
        }
      })

      //get all shows running in current city
      .addCase(getAllShows.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllShows.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getAllShows.rejected, (state, action) => {
        state.loading = false;
        if (isResponseError(action.payload)) {
          if (action.payload.statusCode === 403 || action.payload.statusCode === 401) {
            state.isAuthenticated = false
          }
        }
      })

      //get single movie
      .addCase(getSingleMovie.pending, (state) => {
        state.loading = true;
      })
      .addCase(getSingleMovie.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getSingleMovie.rejected, (state, action) => {
        state.loading = false;
        if (isResponseError(action.payload)) {
          console.log(action.payload)
          if (action.payload.statusCode === 403 || action.payload.statusCode === 401) {
            state.isAuthenticated = false
          }
        }
      })

  },

});

export const {
  userClearError,
  userSetError,
  userSetIsAuthenticated,
  userSetLoading,
  userSetCity,
  userClearTempMail
} = userSlice.actions
export default userSlice.reducer