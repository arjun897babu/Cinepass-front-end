import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IInitialState } from "./IState";
import { createTheaterScreen, forgotPasswordTheaters, getAllShows, getScreen, getTheaterDetails, loginTheaters, logoutTheaters, resendOTPTheaters, resetPasswordTheaters, signupTheaters, updateTheater, verifyOTPTheaters } from "../actions/theaterAction";
import { IInitialStateError, ResponseData } from "../../interface/Interface";
import { handleAxiosError, IResponseError, isErrorResponse, isResponseError } from "../../utils/customError";
import { LoggedOwner } from "../../interface/user/IUserData";
import { FaGlasses } from "react-icons/fa";




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
    theaterClearError(state) {
      state.error = null
    },
    theaterSetLoading(state) {
      state.loading = !state.loading
    },
    theaterSetError(state, action: PayloadAction<IInitialStateError>) {
      state.error = action.payload
    },
    theaterSetIsAuthenticated(state) {
      state.isAuthenticated = !state.isAuthenticated
    },
    TheaterClearTempMail(state) {
      state.tempMail = null
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
        state.tempMail = action.payload.data ? action.payload.data as { email: string } : null
      })
      .addCase(signupTheaters.rejected, (state, action) => {
        state.loading = false;
        if (isResponseError(action.payload)) {
          if (action.payload.statusCode === 401 && action.payload.data.error === 'otp') {
            state.tempMail = action.payload.data ? action.payload.data.tempMail as { email: string } : null
          }
        }
      })

      
      //login
      .addCase(loginTheaters.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.owner = action.payload.data ? action.payload.data as unknown as LoggedOwner : null
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


      //create theater screen
      .addCase(createTheaterScreen.pending, (state) => {
        state.loading = true
      })
      .addCase(createTheaterScreen.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createTheaterScreen.rejected, (state, action) => {
        state.loading = false;
        isResponseError(action.payload) ?
          handleRejectedCase(state, action.payload) : null

      })
      //get theater screen  
      .addCase(getScreen.pending, (state) => {
        state.loading = true
      })
      .addCase(getScreen.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getScreen.rejected, (state, action) => {
        state.loading = false;
        isResponseError(action.payload) ?
          handleRejectedCase(state, action.payload) : null
      })
      //get theater details
      .addCase(getTheaterDetails.pending, (state) => {
        state.loading = true
      })
      .addCase(getTheaterDetails.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getTheaterDetails.rejected, (state, action) => {
        isResponseError(action.payload) ?
          handleRejectedCase(state, action.payload) : null
      })
      //update theater details
      .addCase(updateTheater.pending, (state) => {
        state.loading = true
      })
      .addCase(updateTheater.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTheater.rejected, (state, action) => {
        isResponseError(action.payload) ?
          handleRejectedCase(state, action.payload) : null
      })

      //get all shows
      .addCase(getAllShows.rejected, (state, action) => {
        isResponseError(action.payload) ?
          handleRejectedCase(state, action.payload) : null
      })

  }
})
export const {
  TheaterClearTempMail, theaterClearError,
  theaterSetError, theaterSetIsAuthenticated, theaterSetLoading
} = theaterSlice.actions
export default theaterSlice.reducer


export function handleRejectedCase(state: IInitialState, payload: IResponseError) {

  if (payload.statusCode === 403 || payload.statusCode === 401) {
    state.isAuthenticated = false;
    state.loading = false
    state.owner = null
  }
}