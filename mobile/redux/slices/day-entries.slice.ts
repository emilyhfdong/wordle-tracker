import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface IDayEntry {
  date: string
  word: string
  attemptCount: number
  attemptDetails: number
}

const initialState: IDayEntry[] = []

export const dayEntriesSlice = createSlice({
  name: "dayEntries",
  initialState,
  reducers: {
    addDayEntry: (state, action: PayloadAction<IDayEntry>) => [
      ...state,
      action.payload,
    ],
  },
})

export const dayEntriesActions = dayEntriesSlice.actions
