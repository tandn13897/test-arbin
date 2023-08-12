import { configureStore } from '@reduxjs/toolkit'
import dataReducer from './data.slice'
import { dataApi } from './data.services'

export const store = configureStore({
  reducer: {
    Data: dataReducer,
    [dataApi.reducerPath]: dataApi.reducer,
  },

  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(dataApi.middleware)
  }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch