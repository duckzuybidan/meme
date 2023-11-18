
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import memeReducer from './memeSlice'
import commentReducer from './commentSlice'
import { persistReducer, persistStore } from 'redux-persist'

import createWebStorage from "redux-persist/lib/storage/createWebStorage";

const createNoopStorage = () => {
  return {
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage()

const rootReducer = combineReducers({ 
  user: userReducer,
  meme: memeReducer,
  comment: commentReducer
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
export const persistor = persistStore(store)
export type RootState = ReturnType<typeof rootReducer>