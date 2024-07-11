import { AsyncThunk, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { serverInstance } from "../../services";
import { theatersEndPoints } from "../../services/endpoints/endPoints";
import { TheaterSignUpData } from "../../interface/theater/ITheatersData";


export const signupTheaters: AsyncThunk<any, TheaterSignUpData, any> = createAsyncThunk(
  'admin/signup',
  async (theatersData, { rejectWithValue }) => {
    console.log('reaching theaters signup action');
    try {
      const response = await serverInstance.post(theatersEndPoints.signup, theatersData);
      console.log('reponse of theater asyncthunk ', response)
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(error.response?.data)
      }
      return rejectWithValue('an unknown erro occurred')
    }
  }

)