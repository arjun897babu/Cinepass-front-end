// src/app/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer, { UserState } from './reducers/userReducer'
import theatersReducer, { TheaterState } from './reducers/theatersReducer';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';


const persistConfig = {
  key: 'cine',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
  user: userReducer,
  theater: theatersReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware:(getMiddleWare)=>
    getMiddleWare({
      serializableCheck:false
    })

  
})


export const persist = persistStore(store)
export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type { UserState, TheaterState };