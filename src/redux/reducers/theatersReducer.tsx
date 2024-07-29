import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState } from "./IState";
import { forgotPasswordTheaters, getTheaterDetails, loginTheaters, logoutTheaters, resendOTPTheaters, resetPasswordTheaters, signupTheaters, verifyOTPTheaters } from "../actions/theaterAction";
import { IInitialStateError, ResponseData } from "../../interface/Interface";
import { isErrorResponse } from "../../utils/customError";
import { LoggedOwner } from "../../interface/user/IUserData";




const initialState: IInitialState = {
  owner: null,
  loading: false,
  error: null,
  tempMail: null,
  isAuthenticated: false

}

const theaterSlice = createSlice({
  name: 'theaters',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null
    },
    setLoading(state) {
      state.loading = !state.loading
    },
    setError(state, action: PayloadAction<IInitialStateError>) {
      state.error = action.payload
    },
    setIsAuthenticated(state) {
      state.isAuthenticated = !state.isAuthenticated
    }
  },
  extraReducers: (builder) => {
    builder
      //signup
      .addCase(signupTheaters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupTheaters.fulfilled, (state, action: PayloadAction<ResponseData>) => {
        console.log(action.payload)
        state.loading = false;
        state.tempMail = action.payload.data ? action.payload.data as { email: string } : null
      })
      .addCase(signupTheaters.rejected, (state, action) => {
        state.loading = false;
        if (isErrorResponse(action.payload)) {
          state.error = action.payload.error as IInitialStateError
        }
      })
      //login
      .addCase(loginTheaters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginTheaters.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.owner = action.payload.data ? action.payload.data as unknown as LoggedOwner : null
      })
      .addCase(loginTheaters.rejected, (state, action) => {
        state.loading = false
        if (isErrorResponse(action.payload)) {
          state.error = action.payload.error as IInitialStateError;
          state.tempMail = action.payload.data ? action.payload.data as { email: string } : null
        }
      })

      //otp-verification
      .addCase(verifyOTPTheaters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTPTheaters.fulfilled, (state) => {
        state.loading = false;
        state.tempMail = null
      })
      .addCase(verifyOTPTheaters.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false
        if (isErrorResponse(action.payload)) {

          state.error = action.payload.error as IInitialStateError | null
        }
      })

      //logout
      .addCase(logoutTheaters.pending, (state) => {
        state.loading = true;
        state.error = null
      })
      .addCase(logoutTheaters.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false
        state.owner = null
      })
      .addCase(logoutTheaters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as IInitialStateError | null
      })
      //forgot password
      .addCase(forgotPasswordTheaters.pending, (state) => {
        state.loading = true
      })
      .addCase(forgotPasswordTheaters.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(forgotPasswordTheaters.rejected, (state) => {
        state.loading = false;

      })
      //reset password
      .addCase(resetPasswordTheaters.pending, (state) => {
        state.loading = true
      })
      .addCase(resetPasswordTheaters.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(resetPasswordTheaters.rejected, (state, action) => {
        state.loading = false
        if (isErrorResponse(action.payload)) {
          if (action.payload.error && action.payload.error.error === 'password') {
            state.error = action.payload.error as IInitialStateError | null
          }
        }
      })
      //resend otp
      .addCase(resendOTPTheaters.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendOTPTheaters.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOTPTheaters.rejected, (state, action) => {
        state.loading = false;
        if (isErrorResponse(action.payload)) {
          if (action.payload.error && action.payload.error.error === 'otp') {
            state.error = action.payload.error as IInitialStateError | null
          }
        }
      })
      //get theater details of owner
      .addCase(getTheaterDetails.pending,(state)=>{
        state.loading = true
      })
      .addCase(getTheaterDetails.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getTheaterDetails.rejected, (state, action) => {
        state.loading = false;
        console.log(action)
      })

  }
})
export const {
  clearError: clearTheaterError,
  setLoading: setTheaterLoading,
  setError: setTheaterError,
  setIsAuthenticated: setTheatersAuthentication
} = theaterSlice.actions
export default theaterSlice.reducer