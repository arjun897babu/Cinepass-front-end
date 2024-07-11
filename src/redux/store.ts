// src/app/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer, { UserState } from './reducers/userReducer'
import theatersReducer, { TheaterState } from './reducers/theatersReducer';

const reducers = combineReducers({
  user: userReducer,
  theater: theatersReducer
})

const store = configureStore({
  reducer: reducers
})
export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type { UserState, TheaterState };