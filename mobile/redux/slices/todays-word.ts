import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ITodaysWord {
  currentGuess: string
  prevGuesses: string[]
}

const initialState: ITodaysWord = {
  currentGuess: "",
  prevGuesses: [],
}

export const todaysWordSlice = createSlice({
  name: "todaysWord",
  initialState,
  reducers: {
    setCurrentGuess: (state, action: PayloadAction<string>) => ({
      ...state,
      currentGuess: action.payload,
    }),
    setPrevGuesses: (state, action: PayloadAction<string[]>) => ({
      ...state,
      prevGuesses: action.payload,
    }),
  },
})

export const todaysWordActions = todaysWordSlice.actions
