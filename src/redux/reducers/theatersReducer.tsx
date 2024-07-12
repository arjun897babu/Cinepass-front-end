import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState } from "./IState";
import { signupTheaters } from "../actions/theatersReducer";

export interface TheaterState extends IInitialState {
  theaters: any,
};

const initialState: TheaterState = {
  theaters: null,
  loading: false,
  error: null,
  tempMail:null,
  isAuthenticated:false
  
}

const theaterSlice = createSlice({
  name: 'theaters',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupTheaters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupTheaters.fulfilled, (state, action: PayloadAction<any>) => {
        console.log(action.payload)
        state.loading = false;
        state.theaters = action.payload;
      })
      .addCase(signupTheaters.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = { ...action.payload }
      })
  }
})

export default theaterSlice.reducer