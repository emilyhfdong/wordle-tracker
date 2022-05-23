import { theme } from "../constants"

export const getTiles = (
  guess: string,
  answer: string
): { letter: string; color: string }[] => {
  const tiles = new Array(5)
    .fill(null)
    .map((_, idx) => ({ letter: guess[idx] || "", color: theme.light.grey }))

  return answer.split("").reduce((acc, answerLetter, idx) => {
    if (acc[idx].letter === answerLetter) {
      acc[idx].color = theme.light.green
      return acc
    }
    const matchingYellow = acc.find(
      (tile) => tile.letter === answerLetter && tile.color !== theme.light.green
    )
    if (matchingYellow) {
      matchingYellow.color = theme.light.yellow
    }
    return acc
  }, tiles)
}
