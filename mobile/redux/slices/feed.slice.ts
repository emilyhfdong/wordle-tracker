import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IDayEntry } from "./day-entries.slice"

export interface IFeedDayEntry extends IDayEntry {
  userId: string
  createdAt: string
}

export interface IFriends {
  [key: string]: {
    name: string
    color: string
    lastEntryDate: string
    currentStreak: number
  }
}

export interface IFeed {
  friends: IFriends | null
  groupedEntries: { date: string; entries: IFeedDayEntry[] }[] | null
}

const initialState: IFeed = { friends: null, groupedEntries: null }

export const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setGroupedEntries: (
      state,
      action: PayloadAction<{ date: string; entries: IFeedDayEntry[] }[]>
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
