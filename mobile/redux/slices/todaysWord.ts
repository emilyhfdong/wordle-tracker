import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TTodaysWordResponse } from "../../services"

const initialState: TTodaysWordResponse & {
  currentGuess: string
  prevGuesses: string[]
} = {
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
    setNewWord: (_, action: PayloadAction<TTodaysWordResponse>) => ({
      ...action.payload,
      currentGuess: "",
      prevGuesses: [],
    }),
    clearGuesses: (state) => ({ ...state, prevGuesses: [], currentGuess: "" }),
  },
})

export const todaysWordActions = todaysWordSlice.actions
