import { theme } from "../constants"
import { getTiles } from "./tiles"

export const isEasyMode = (
  guess: string,
  prevGuessses: string[],
  answer: string
) => {
  const lastGuess = prevGuessses[prevGuessses.length - 1]

  if (!lastGuess) {
    return false
  }

  const lastGuessTiles = getTiles(lastGuess, answer)
  const alreadyUsedIndex: number[] = []

  for (let i = 0; i < lastGuessTiles.length; i++) {
    const lastGuessTile = lastGuessTiles[i]

    if (
      lastGuessTile.color === theme.light.green &&
      guess[i] !== lastGuessTile.letter
    ) {
      return true
    }

    if (lastGuessTile.color === theme.light.yellow) {
      const yellowGuessLetter = guess
        .split("")
        .find(
          (letter, idx) =>
            letter === lastGuessTile.letter && !alreadyUsedIndex.includes(idx)
        )
      if (!yellowGuessLetter) {
        return true
      } else {
        alreadyUsedIndex.push(guess.split("").indexOf(yellowGuessLetter))
      }
    }
  }
  return false
}
