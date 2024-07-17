import { createSlice } from "@reduxjs/toolkit";
import { IInitialState } from "./IState";

import { IInitialStateError } from "../../interface/Interface";
import { loginAdmin, logoutAdmin } from "../actions/adminAction";
import { isEmpty } from "@cloudinary/url-gen/backwards/utils/isEmpty";
import { isErrorResponse } from "../../utils/customError";
import { FaFileShield } from "react-icons/fa6";


const initialState: IInitialState = {
  owner: null,
  loading: false,
  isAuthenticated: false,
  tempMail: null,
  error: null
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true,
          state.error = null
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = null;
        state.owner = action.payload.data ? action.payload.data[0] : null

      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false
        if (isErrorResponse(action.payload)) {

          state.error = action.payload.error as IInitialStateError
        }
      })
      .addCase(logoutAdmin.pending, (state) => {
        state.loading = true;
        state.error = null
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false
        state.owner = null
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as IInitialStateError | null
      })
  }
})
export const { clearError:clearAdminError } = adminSlice.actions
export default adminSlice.reducer