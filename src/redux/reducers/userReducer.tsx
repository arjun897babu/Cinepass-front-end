import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { forgotPasswordUser, getAllShows, googleSignUp, loginUser, logoutUser, resendOTPUser, resetPassword, signUpUser, verifyUser } from "../actions/userAction";
import { IInitialState } from "./IState";
import { IInitialStateError, ResponseData, ResponseStatus } from "../../interface/Interface";
import { isErrorResponse } from "../../utils/customError";
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
    clearError(state) {
      state.error = null;
    },
    setError(state, action: PayloadAction<IInitialStateError>) {
      state.error = action.payload
    },
    setIsAuthenticated(state) {
      state.isAuthenticated = !state.isAuthenticated
    },
    setLoading(state) {
      state.loading = !state.loading
    },
    setCity(state, action: PayloadAction<string>) {
      state.city = action.payload
    },
    clearTempMail(state) {
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
        state.loading = true;
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<ResponseData>) => {
        state.loading = false;
        state.error = null
        state.isAuthenticated = action.payload.status === ResponseStatus.SUCCESS
        state.owner = action.payload.data ? action.payload.data as unknown as LoggedOwner : null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        if (isErrorResponse(action.payload)) {
          state.error = action.payload.error as IInitialStateError
          state.tempMail = action.payload.data ? action.payload.data as { email: string } : null
        }
      })

      //google login
      .addCase(googleSignUp.pending, (state) => {
        state.loading = true;
        state.error = null
      })
      .addCase(googleSignUp.fulfilled, (state, action: PayloadAction<ResponseData>) => {
        state.loading = false;
        state.error = null
        state.isAuthenticated = action.payload.status === ResponseStatus.SUCCESS
        state.owner = action.payload.data ? action.payload.data as unknown as LoggedOwner : null
        state.isGoogleAuth = true
      })
      .addCase(googleSignUp.rejected, (state, action) => {
        state.loading = false;
        if (isErrorResponse(action.payload)) {
          state.error = action.payload.error as IInitialStateError
          state.tempMail = action.payload.data ? action.payload.data as { email: string } : null
        }
      })
      //logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null
        state.isAuthenticated = false;
        state.owner = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        if (isErrorResponse(action.payload)) {
          state.error = action.payload.error as IInitialStateError | null
        }
      })

      //verifying otp
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUser.fulfilled, (state) => {
        state.loading = false;
        state.owner = null;
        state.isAuthenticated = false;
        state.tempMail = null;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.owner = null
        state.isAuthenticated = false;
        if (isErrorResponse(action.payload)) {
          if (action.payload.error && action.payload.error.error === 'otp') {
            state.error = action.payload.error as IInitialStateError | null
          }
        }
      })
      //forgot password
      .addCase(forgotPasswordUser.pending, (state) => {
        state.loading = true
      })
      .addCase(forgotPasswordUser.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(forgotPasswordUser.rejected, (state) => {
        state.loading = false;

      })
      //reset password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        if (isErrorResponse(action.payload)) {
          if (action.payload.error && action.payload.error.error === 'password') {
            state.error = action.payload.error as IInitialStateError | null
          }
        }
      })
      //resend otp
      .addCase(resendOTPUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendOTPUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOTPUser.rejected, (state, action) => {
        state.loading = false;
        if (isErrorResponse(action.payload)) {
          if (action.payload.error && action.payload.error.error === 'otp') {
            state.error = action.payload.error as IInitialStateError | null
          }
        }
      })
      .addCase(getAllShows.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllShows.fulfilled, (state) => {
        state.loading = false;

      })
      .addCase(getAllShows.rejected, (state, action) => {
        state.loading = false;
        if (isErrorResponse(action.payload)) {

        }
      })

  },

});

export const {
  clearError: clearUserError,
  setError: setUserError,
  setIsAuthenticated: setUserAuthentication,
  setLoading: setUserLoading,
  setCity: setUserCity,
  clearTempMail:clearUserTempMail
} = userSlice.actions
export default userSlice.reducer