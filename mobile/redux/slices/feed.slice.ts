import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IDayEntry } from "./day-entries.slice"

export type TPingStatus = "notifications_disabled" | "already_pinged" | "ready"

interface IFriend {
  name: string
  color: string
  lastEntryDate: string
  currentStreak: number
  averageAttemptsCount: number
  pingStatus: TPingStatus
}

export interface IFriends {
  [key: string]: IFriend
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
    editFriend: (
      state,
      action: PayloadAction<{
        friendId: string
        updatedFields: Partial<IFriend>
      }>
    ) =>
      state.friends
        ? {
            ...state,
            friends: {
              ...state.friends,
              [action.payload.friendId]: {
                ...state.friends?.[action.payload.friendId],
                ...action.payload.updatedFields,
              },
            },
          }
        : state,
  },
})

export const feedActions = feedSlice.actions
