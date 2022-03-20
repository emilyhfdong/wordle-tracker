import { useContext, useEffect, useRef } from "react"
import { Animated, Text, View } from "react-native"
import { theme } from "../constants/theme"
import { WordContext } from "../context/word-context"

interface ITileProps {
  letter: string | null
  locked: boolean
  index: number
  hasWon: boolean
}

interface IGetLockedColorArgs {
  letter: string | null
  word: string
  index: number
}

const getLockedColor = ({ letter, word, index }: IGetLockedColorArgs) => {
  if (word[index] === letter) return theme.light.green
  if (letter && word.includes(letter)) return theme.light.yellow
  return theme.light.grey
}

export const FLIP_DURATION_IN_S = 0.25
export const TOTAL_WORD_FLIP_DURATION_IN_S = FLIP_DURATION_IN_S * 6

export const Tile: React.FC<ITileProps> = ({ letter, index, locked }) => {
  const word = useContext(WordContext)
  const lockedColor = getLockedColor({ letter, word, index })
  const borderColor = locked
    ? lockedColor
    : letter
    ? theme.light.grey
    : theme.light.lightGrey
  return (
    <Animated.View
      style={{
        height: 65,
        width: 65,
        borderWidth: 2,
        borderColor,
        marginBottom: 6,
        marginLeft: index === 0 ? 0 : 6,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: locked ? lockedColor : theme.light.background,
      }}
    >
      <Text
        style={{
          fontSize: 32,
          fontWeight: "bold",
          color: locked ? theme.light.background : theme.light.default,
        }}
      >
        {letter}
      </Text>
    </Animated.View>
  )
}
