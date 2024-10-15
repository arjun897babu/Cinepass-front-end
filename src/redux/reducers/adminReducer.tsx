import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState } from "./IState";

import { IInitialStateError } from "../../interface/Interface";
import { loginAdmin, logoutAdmin, getEntityDataForAdmin, manageEntitiesByAdmin, updateTheaterApprovalForAdmin, adminGetEntityStat, getStreamPlan, editStreamPlan, addStreamPlan, getStreamingMovies, getMovie, addMovie, updateMovie } from "../actions/adminAction";
import { isErrorResponse, isResponseError } from "../../utils/customError";
import { LoggedOwner } from "../../interface/user/IUserData";
import { handleRejectedCase } from "./theatersReducer";


const initialState: IInitialState = {
  profile: null,
  isAuthenticated: false,
  tempMail: null,
  error: null,


}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    adminClearError(state: IInitialState) {
      state.error = null

    },
    adminSetError(state: IInitialState, action: PayloadAction<IInitialStateError>) {
      state.error = action.payload

    },
    adminSetIsAuthenticated(state: IInitialState) {
      state.isAuthenticated = !state.isAuthenticated

    },


  },
  extraReducers: (builder) => {
    /********************************************************************
   *                                 Auth                               *
   ********************************************************************/
    builder
      .addCase(loginAdmin.pending, (state: IInitialState) => {
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state: IInitialState, action) => {
        state.isAuthenticated = true;
        state.error = null;
        state.profile = action.payload.data ? (action.payload.data as unknown as LoggedOwner) : null;
      })
      .addCase(loginAdmin.rejected, (state: IInitialState, action) => {
        if (isErrorResponse(action.payload)) {
          state.isAuthenticated = false;
          state.profile = null;
          state.error = action.payload.error as IInitialStateError;
        }
      })
      .addCase(logoutAdmin.pending, (state: IInitialState) => {
        state.error = null;
      })
      .addCase(logoutAdmin.fulfilled, (state: IInitialState) => {
        state.error = null;
        state.isAuthenticated = false;
        state.profile = null;
      })
      .addCase(logoutAdmin.rejected, (state: IInitialState, action) => {
        isResponseError(action.payload) ? handleRejectedCase(state, action.payload) : null;
      });


    /********************************************************************
    *                        Entity Management                          *
    *********************************************************************/
    builder
      .addCase(getEntityDataForAdmin.pending, (state: IInitialState) => {
        state.error = null;
      })
      .addCase(getEntityDataForAdmin.rejected, (state: IInitialState, action) => {
        if (isErrorResponse(action.payload)) {
          state.isAuthenticated = false;
          state.profile = null;
          state.error = action.payload.error as IInitialStateError | null;
        }
      })
      .addCase(manageEntitiesByAdmin.pending, (state: IInitialState) => {
        state.error = null;
      })
      .addCase(manageEntitiesByAdmin.rejected, (state: IInitialState, action) => {
        if (isErrorResponse(action.payload)) {
          state.isAuthenticated = false;
          state.profile = null;
          state.error = action.payload.error as IInitialStateError | null;
        }
      })
      .addCase(updateTheaterApprovalForAdmin.pending, (state: IInitialState) => {
        state.error = null;
      })
      .addCase(updateTheaterApprovalForAdmin.rejected, (state: IInitialState, action) => {
        if (isErrorResponse(action.payload)) {
          state.isAuthenticated = false;
          state.profile = null;
          state.error = action.payload.error as IInitialStateError | null;
        }
      })
      .addCase(adminGetEntityStat.rejected, (state: IInitialState, action) => {
        isResponseError(action.payload) ? handleRejectedCase(state, action.payload) : null;
      });



    /********************************************************************
    *                            Steam Plan                             *
    *********************************************************************/

    builder
      .addCase(getStreamPlan.rejected, (state: IInitialState, action) => {
        isResponseError(action.payload) ? handleRejectedCase(state, action.payload) : null;
      })
      .addCase(editStreamPlan.rejected, (state: IInitialState, action) => {
        isResponseError(action.payload) ? handleRejectedCase(state, action.payload) : null;
      })
      .addCase(addStreamPlan.rejected, (state: IInitialState, action) => {
        isResponseError(action.payload) ? handleRejectedCase(state, action.payload) : null;
      });

    /********************************************************************
    *                          Movie Management                         *
    *********************************************************************/
    builder
      .addCase(getStreamingMovies.rejected, (state: IInitialState, action) => {
        isResponseError(action.payload) ? handleRejectedCase(state, action.payload) : null;
      })
      .addCase(getMovie.rejected, (state: IInitialState, action) => {
        isResponseError(action.payload) ? handleRejectedCase(state, action.payload) : null;
      })
      .addCase(addMovie.rejected, (state: IInitialState, action) => {
        isResponseError(action.payload) ? handleRejectedCase(state, action.payload) : null;
      })
      .addCase(updateMovie.rejected, (state: IInitialState, action) => {
        isResponseError(action.payload) ? handleRejectedCase(state, action.payload) : null;
      });
  }
});

export const {
  adminClearError, adminSetError, adminSetIsAuthenticated,
} = adminSlice.actions

export default adminSlice.reducer