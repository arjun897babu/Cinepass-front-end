import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState } from "./IState";
import { loginTheaters, logoutTheaters, signupTheaters, verifyOTPTheaters } from "../actions/theaterAction";
import { IInitialStateError, ResponseData } from "../../interface/Interface";
import { TheatersLogin } from "../../pages/theaters";
import { isErrorResponse } from "../../utils/customError";




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
    changeLoading(state, action) {
      state.loading = !action.payload
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
        state.tempMail = action.payload.data ? action.payload.data[0] as { email: string } : null
      })
      .addCase(signupTheaters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as IInitialStateError
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
        state.owner = action.payload.data ? action.payload.data[0] : null
      })
      .addCase(loginTheaters.rejected, (state, action) => {
        state.loading = false
        if (isErrorResponse(action.payload)) {
          state.error = action.payload.error as IInitialStateError;
          state.tempMail = action.payload.data ? action.payload.data[0] as { email: string } : null
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
        state.error = action.payload as IInitialStateError
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
  }
})
export const { clearError:clearTheaterError, changeLoading } = theaterSlice.actions
export default theaterSlice.reducer