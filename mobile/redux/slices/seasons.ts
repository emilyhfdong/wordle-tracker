import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ISeasonState {
  seenSeasonNames: string[]
  seenWrappedSeasonNames: string[]
}

const initialState: ISeasonState = {
  seenSeasonNames: [],
  seenWrappedSeasonNames: [],
}

export const seasonsSlice = createSlice({
  name: "seasons",
  initialState,
  reducers: {
    addSeasonName: (state, action: PayloadAction<string>) => ({
      ...state,
      seenSeasonNames: [...state.seenSeasonNames, action.payload],
    }),
    addWrappedSeasonName: (state, action: PayloadAction<string>) => ({
      ...state,
      seenWrappedSeasonNames: state.seenWrappedSeasonNames
        ? [...state.seenWrappedSeasonNames, action.payload]
        : [action.payload],
    }),
  },
})

export const seasonsActions = seasonsSlice.actions
