import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState } from "./IState";

import { IInitialStateError } from "../../interface/Interface";
import { getEntityDataForAdmin, loginAdmin, logoutAdmin, manageEntitiesByAdmin, updateTheaterApprovalForAdmin } from "../actions/adminAction";
import { isErrorResponse } from "../../utils/customError";
import { LoggedOwner } from "../../interface/user/IUserData";


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
        state.owner = action.payload.data ? action.payload.data as unknown as LoggedOwner : null
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
      //get entity data  for admin
      .addCase(getEntityDataForAdmin.pending, (state) => {
        state.loading = true,
          state.error = null
      })
      .addCase(getEntityDataForAdmin.fulfilled, (state) => {
          state.loading = false;
      })
      .addCase(getEntityDataForAdmin.rejected, (state, action) => {
        state.loading = false
        if (isErrorResponse(action.payload)) {
          state.error = action.payload.error as IInitialStateError | null
        }
      })
      //updating approval status
      .addCase(updateTheaterApprovalForAdmin.pending, (state) => {
        // state.loading = true,
          state.error = null
      })
      .addCase(updateTheaterApprovalForAdmin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTheaterApprovalForAdmin.rejected, (state, action) => {
        state.loading = false
        if (isErrorResponse(action.payload)) {
          state.error = action.payload.error as IInitialStateError | null
        }
      })

      //manageEntity status
      .addCase(manageEntitiesByAdmin.pending, (state) => {
        // state.loading = true
        state.error = null
      })
      .addCase(manageEntitiesByAdmin.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(manageEntitiesByAdmin.rejected, (state, action) => {
        state.loading = false
        if (isErrorResponse(action.payload)) {
          state.error = action.payload.error as IInitialStateError | null
        }
      })
  }
});

export const {
  clearError: clearAdminError,
  setError: setAdminError,
  setIsAuthenticated: setAdminAuthentication,
  setLoading: setAdminLoading
} = adminSlice.actions

export default adminSlice.reducer