import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface IDayEntry {
  date: string
  word: string
  attemptsCount: number
  attemptsDetails: string
  number: number
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
  },
})

export const dayEntriesActions = dayEntriesSlice.actions
