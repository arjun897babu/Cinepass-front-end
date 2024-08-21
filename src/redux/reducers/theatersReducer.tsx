import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState } from "./IState";
import { createTheaterScreen, forgotPasswordTheaters, getScreen, getTheaterDetails, loginTheaters, logoutTheaters, resendOTPTheaters, resetPasswordTheaters, signupTheaters, updateTheater, verifyOTPTheaters } from "../actions/theaterAction";
import { IInitialStateError, ResponseData } from "../../interface/Interface";
import { isErrorResponse, isResponseError } from "../../utils/customError";
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
    theaterClearError(state) {
      state.error = null
    },
    theaterSetLoading(state) {
      state.loading = !state.loading
    },
    theaterSetError(state, action: PayloadAction<IInitialStateError>) {
      state.error = action.payload
    },
    theaterSetIsAuthenticated(state) {
      state.isAuthenticated = !state.isAuthenticated
    },
    TheaterClearTempMail(state) {
      state.tempMail = null
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

      //create theater screen
      .addCase(createTheaterScreen.pending, (state) => {
        state.loading = true
      })
      .addCase(createTheaterScreen.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createTheaterScreen.rejected, (state, action) => {
        state.loading = false;
        if (isResponseError(action.payload)) {
          if (action.payload.statusCode === 403 || action.payload.statusCode === 401) {
            state.isAuthenticated = false
          }
        }

      })
      //get theater screen  
      .addCase(getScreen.pending, (state) => {
        state.loading = true
      })
      .addCase(getScreen.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getScreen.rejected, (state, action) => {
        state.loading = false;
        if (isResponseError(action.payload)) {
          console.log(action.payload)
          if (action.payload.statusCode === 403 || action.payload.statusCode === 401) {
            state.isAuthenticated = false
          }
        }

      })
      //get theater details
      .addCase(getTheaterDetails.pending, (state) => {
        state.loading = true
      })
      .addCase(getTheaterDetails.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getTheaterDetails.rejected, (state, action) => {
        state.loading = false;
        if (isResponseError(action.payload)) {
          if (action.payload.statusCode === 403 || action.payload.statusCode === 401) {
            state.isAuthenticated = false
          }
        }

      })
      //update theater details
      .addCase(updateTheater.pending, (state) => {
        state.loading = true
      })
      .addCase(updateTheater.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTheater.rejected, (state, action) => {
        state.loading = false;
        if (isResponseError(action.payload)) {
          if (action.payload.statusCode === 403 || action.payload.statusCode === 401) {
            state.isAuthenticated = false
          }
        }

      })

  }
})
export const {
  TheaterClearTempMail, theaterClearError,
  theaterSetError, theaterSetIsAuthenticated, theaterSetLoading
} = theaterSlice.actions
export default theaterSlice.reducer