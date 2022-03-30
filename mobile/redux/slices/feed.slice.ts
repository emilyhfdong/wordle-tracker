import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IDayEntry } from "./day-entries.slice"

export interface IFriends {
  [key: string]: {
    name: string
    color: string
    lastEntryDate: string
    currentStreak: number
    averageAttemptsCount: number
  }
}

export interface IFeed {
  friends: IFriends | null
  groupedEntries: { date: string; entries: IDayEntry[] }[] | null
}

const initialState: IFeed = { friends: null, groupedEntries: null }

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setGroupedEntries: (
      state,
      action: PayloadAction<{ date: string; entries: IDayEntry[] }[]>
    ) => ({
      ...state,
      groupedEntries: action.payload,
    }),
    setFriends: (state, action: PayloadAction<IFriends>) => ({
      ...state,
      friends: action.payload,
    }),
  },
})

export const feedActions = feedSlice.actions
