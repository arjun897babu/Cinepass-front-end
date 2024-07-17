import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, logoutUser, signUpUser, verifyUser } from "../actions/userAction";
import { IInitialState } from "./IState";
import { IInitialStateError, ResponseData, ResponseStatus } from "../../interface/Interface";
import { isErrorResponse } from "../../utils/customError";



const initialState: IInitialState = {
  owner: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  tempMail: null

};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
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
        state.tempMail = action.payload.data ? action.payload.data[0] : null
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
        if (action.payload.data) {
          console.log(action.payload.data)
        };
        state.owner = action.payload.data ? action.payload.data[0] : null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        if (isErrorResponse(action.payload)) {
          state.error = action.payload.error as IInitialStateError
          state.tempMail = action.payload.data ? action.payload.data[0] as { email: string } : null
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
          state.error = action.payload.error as IInitialStateError | null
        }
      })

  },

});

export const { clearError: clearUserError } = userSlice.actions
export default userSlice.reducer