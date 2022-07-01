import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ISeasonState {
  seenSeasonNames: string[]
}

const initialState: ISeasonState = {
  seenSeasonNames: [],
}

export const seasonsSlice = createSlice({
  name: "seasons",
  initialState,
  reducers: {
    addSeasonName: (state, action: PayloadAction<string>) => ({
      ...state,
      seenSeasonNames: [...state.seenSeasonNames, action.payload],
    }),
  },
})

export const seasonsActions = seasonsSlice.actions
