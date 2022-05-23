import { theme } from "../../../constants"
import { TGetUserResponse } from "../../../services"
import { getTiles } from "../../../utils"

const tileColorToEmoji = {
  [theme.light.yellow]: "🟨",
  [theme.light.green]: "🟩",
  [theme.light.grey]: "⬜",
}

const getSquares = (guesses: string[], word: string) => {
  const getRow = (guess: string) => {
    return getTiles(guess, word)
      .map(({ color }) => tileColorToEmoji[color])
      .join("")
  }
  return guesses.map(getRow).join("\r\n")
}

export const getShareMessage = (entry?: TGetUserResponse["lastEntry"]) => {
  if (!entry) {
    return ""
  }
  const { attemptsCount, attemptsDetails, word } = entry
  return `Wordzle ${word.number} ${attemptsCount}/6\n\n${getSquares(
    attemptsDetails.split(" "),
    word.answer
  )}`
}
