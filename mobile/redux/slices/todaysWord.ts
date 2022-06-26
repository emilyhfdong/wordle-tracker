import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface ITodaysWord {
  currentGuess: string
  prevGuesses: string[]
  word: string
  number: number
  date: string
}

const initialState: ITodaysWord = {
  currentGuess: "",
  prevGuesses: [],
  word: "",
  number: 0,
  date: "",
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
    setNewWord: (
      _,
      action: PayloadAction<{ word: string; number: number; date: string }>
    ) => ({ ...action.payload, currentGuess: "", prevGuesses: [] }),
    clearGuesses: (state) => ({ ...state, prevGuesses: [], currentGuess: "" }),
  },
})

export const todaysWordActions = todaysWordSlice.actions
