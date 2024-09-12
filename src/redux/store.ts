import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from './reducers/userReducer';
import theatersReducer from './reducers/theatersReducer';
import adminReducer from './reducers/adminReducer';
import { IInitialState } from './reducers/IState';

const userTransform = createTransform(

  (inboundState:any ) => { 
    const { movies, cityTheaters, ...rest } = inboundState;
    return rest;
  },

  (outboundState ) => outboundState,
  { whitelist: ['user'] }
);



const persistConfig = {
  key: 'cine',
  storage,
 transforms:[userTransform]
};

const rootReducer = combineReducers({
  user: userReducer,
  theaters: theatersReducer,
  admin: adminReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer as any );

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persist = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;

export default store;
