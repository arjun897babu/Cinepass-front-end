import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState } from "./IState";

import { IInitialStateError } from "../../interface/Interface";
import { loginAdmin, logoutAdmin, getEntityDataForAdmin, manageEntitiesByAdmin, updateTheaterApprovalForAdmin } from "../actions/adminAction";
import { isErrorResponse, isResponseError } from "../../utils/customError";
import { LoggedOwner } from "../../interface/user/IUserData";


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
    adminClearError(state:IInitialState) {
      state.error = null
       
    },
    adminSetError(state:IInitialState, action: PayloadAction<IInitialStateError>) {
      state.error = action.payload
       
    },
    adminSetIsAuthenticated(state:IInitialState) {
      state.isAuthenticated = !state.isAuthenticated
       
    },
   

  },
  extraReducers: (builder) => {
    builder

      .addCase(loginAdmin.pending, (state:IInitialState) => {
         
          state.error = null
      })
      .addCase(loginAdmin.fulfilled, (state:IInitialState, action) => {
        
        state.isAuthenticated = true;
        state.error = null;
        state.profile = action.payload.data ? action.payload.data as unknown as LoggedOwner : null
      })
      .addCase(loginAdmin.rejected, (state:IInitialState, action) => {
         
        if (isErrorResponse(action.payload)) {

          state.error = action.payload.error as IInitialStateError
        }
      })
      .addCase(logoutAdmin.pending, (state:IInitialState) => {
       
        state.error = null
      })
      .addCase(logoutAdmin.fulfilled, (state:IInitialState) => {
        
        state.error = null;
        state.isAuthenticated = false
        state.profile = null
      })
      .addCase(logoutAdmin.rejected, (state:IInitialState, action) => {
        
        if (isResponseError(action.payload)) {
          if (action.payload.statusCode === 401) {
            state.isAuthenticated = false
          }
        }
      })
      //get entity data  for admin
      .addCase(getEntityDataForAdmin.pending, (state:IInitialState) => {
         
          state.error = null
      })
      
      .addCase(getEntityDataForAdmin.rejected, (state:IInitialState, action) => {
         
        if (isErrorResponse(action.payload)) {
          state.error = action.payload.error as IInitialStateError | null
        }
      })
      //manageEntity status
      .addCase(manageEntitiesByAdmin.pending, (state:IInitialState) => {
        // state.loading = true
        state.error = null
      })
     
      .addCase(manageEntitiesByAdmin.rejected, (state:IInitialState, action) => {
         
        if (isErrorResponse(action.payload)) {
          state.error = action.payload.error as IInitialStateError | null
        }
      })
      //updating approval status
      .addCase(updateTheaterApprovalForAdmin.pending, (state:IInitialState) => {
  
        state.error = null
      })
     
      .addCase(updateTheaterApprovalForAdmin.rejected, (state:IInitialState, action) => {
         
        if (isErrorResponse(action.payload)) {
          state.error = action.payload.error as IInitialStateError | null
        }
      })
  }
});

export const {
  adminClearError, adminSetError, adminSetIsAuthenticated,  
} = adminSlice.actions

export default adminSlice.reducer