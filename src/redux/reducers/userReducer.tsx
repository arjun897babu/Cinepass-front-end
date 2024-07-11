import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser, logoutUser, signUpUser } from "../actions/userAction";
import { IInitialState } from "./IState";
import { ResponseData } from "../../interface/Interface";



export interface UserState extends IInitialState {
  user: any;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  token: null
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
      .addCase(signUpUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signUpUser.rejected, (state, action:PayloadAction<any>) => {
        state.loading = false;
        state.error = {...action.payload}  
      })

      //login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<ResponseData>) => {
        state.loading = false;
        state.error = null
        state.user = action.payload.status === 'Success' ? true : null
        console.log('this is state of user', state.user)
      })
      .addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = {...action.payload} 
        state.user = null;
      })
      //logout
      .addCase(logoutUser.pending,(state)=>{
        state.loading = true;
        state.error = null
      })
      .addCase(logoutUser.fulfilled, (state, action: PayloadAction<ResponseData>) => {
        state.loading = false;
        state.error = null
        state.user = action.payload.status === 'Success' ? null : 
        console.log('this is state of user', state.user)
      })
      .addCase(logoutUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = {...action.payload};
        state.user = action.payload.status === 'Success' ? null : 
        console.log('this is state of user', state.user)
      })
    
  },

});

export const {clearError} = userSlice.actions 
export default userSlice.reducer