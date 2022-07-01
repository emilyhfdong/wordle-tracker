import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { todaysWordSlice, userSlice } from "./slices"
import { persistStore, persistReducer } from "redux-persist"
import AsyncStorage from "@react-native-async-storage/async-storage"
import thunk from "redux-thunk"
import { seasonsSlice } from "./slices/seasons"

const rootReducer = combineReducers({
  user: userSlice.reducer,
  todaysWord: todaysWordSlice.reducer,
  seasons: seasonsSlice.reducer,
})

const persistedRootReducer = persistReducer(
  { key: "root", storage: AsyncStorage },
  rootReducer
)

export const store = configureStore({
  reducer: persistedRootReducer,
  middleware: [thunk],
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
