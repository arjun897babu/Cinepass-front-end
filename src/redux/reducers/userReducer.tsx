import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, logoutUser, signUpUser, verifyUser } from "../actions/userAction";
import { IInitialState } from "./IState";
import { IInitialStateError, ResponseData, ResponseStatus } from "../../interface/Interface";
import { isErrorResponse } from "../../utils/customError";
import { LoggedUser } from "../../interface/user/IUserData";



export interface UserState extends IInitialState {
  user: LoggedUser | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  isUser: false,
  tempMail:null

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
      .addCase(signUpUser.fulfilled, (state, action: PayloadAction<ResponseData>) => {
        state.loading = false;
        state.user = action.payload.data ? action.payload.data[0] : null
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as IInitialStateError
      })

      //login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<ResponseData>) => {
        state.loading = false;
        state.error = null
        state.isUser = action.payload.status === ResponseStatus.SUCCESS
        if (action.payload.data) {
          console.log(action.payload.data)
        };
        state.user = action.payload.data ? action.payload.data[0] : null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        if (isErrorResponse(action.payload)) {
          console.log('actin.payload', action.payload.error)
          console.log('actin.payload', action.payload.data)
          state.error = action.payload.error as IInitialStateError
          // state.tempMail = action.payload.data ?action.payload.data:undefined
        }

      })
      //logout
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null
      })
      .addCase(logoutUser.fulfilled, (state, action: PayloadAction<ResponseData>) => {
        state.loading = false;
        state.error = null
        state.isUser = action.payload.status === ResponseStatus.ERROR
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as IInitialStateError | null

      })
      .addCase(verifyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(verifyUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isUser = false;
      })
      .addCase(verifyUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null
        state.isUser = false;
        state.error = action.payload as IInitialStateError | null
      })

  },

});

export const { clearError } = userSlice.actions
export default userSlice.reducer