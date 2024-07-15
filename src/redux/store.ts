// src/app/store.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userReducer'
import theatersReducer from './reducers/theatersReducer';
import adminReducer from './reducers/adminReducer';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage';
import { IInitialState } from './reducers/IState'


const persistConfig = {
  key: 'cine',
  version: 1,
  storage,
}

const rootReducer = combineReducers({
  user: userReducer,
  theater: theatersReducer,
  admin:adminReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getMiddleWare) =>
    getMiddleWare({
      serializableCheck: false
    })


})


export const persist = persistStore(store)
export default store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type { IInitialState };