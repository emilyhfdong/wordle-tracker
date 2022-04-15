import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { todaysWordSlice } from "./slices/todays-word"
import { userSlice } from "./slices/user.slice"
import { persistStore, persistReducer } from "redux-persist"
import AsyncStorage from "@react-native-async-storage/async-storage"
import thunk from "redux-thunk"

const rootReducer = combineReducers({
  user: userSlice.reducer,
  todaysWord: todaysWordSlice.reducer,
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
