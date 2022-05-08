import { theme } from "../../../constants"
import { TDayEntry, TGetUserResponse } from "../../../services"
import { getTileColor } from "../../../shared"

const tileColorToEmoji = {
  [theme.light.yellow]: "🟨",
  [theme.light.green]: "🟩",
  [theme.light.grey]: "⬜",
}

const getSquares = (guesses: string[], word: string) => {
  return guesses
    .map(
      (guess) =>
        `${guess
          .split("")
          .map(
            (letter, index) =>
              tileColorToEmoji[getTileColor({ index, letter, word })]
          )
          .join("")}`
    )
    .join("\r\n")
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
