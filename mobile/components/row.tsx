import React, { useContext } from "react"
import { View } from "react-native"
import { WordContext } from "../context/word-context"
import { Tile } from "./tile"

export const SHAKE_DURATION_IN_S = 0.6

interface IRowProps {
  letters?: string
  locked: boolean
  isNotWord: boolean
}

export const Row: React.FC<IRowProps> = ({
  letters = "",
  locked,
  isNotWord,
}) => {
  const tileLetters = new Array(5)
    .fill(null)
    .map((_, idx) => letters[idx] || null)
  const word = useContext(WordContext)
  return (
    <View style={{ flexDirection: "row" }}>
      {tileLetters.map((letter, idx) => (
        <Tile
          locked={locked}
          letter={letter}
          key={idx}
          index={idx}
          hasWon={letters === word}
        />
      ))}
    </View>
  )
}
