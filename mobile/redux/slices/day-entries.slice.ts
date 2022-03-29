import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface IDayEntry {
  attemptsCount: number
  attemptsDetails: string
  word: {
    answer: string
    date: string
    number: number
  }
  createdAt: string
  userId: string
}

const initialState: IDayEntry[] = []

export const dayEntriesSlice = createSlice({
  name: "dayEntries",
  initialState,
  reducers: {
    addDayEntry: (state, action: PayloadAction<IDayEntry>) => [
      action.payload,
      ...state,
    ],
    setEntries: (_, action: PayloadAction<IDayEntry[]>) => action.payload,
  },
})

export const dayEntriesActions = dayEntriesSlice.actions
