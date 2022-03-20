import { StyleSheet } from "react-native"

import EditScreenInfo from "../components/EditScreenInfo"
import { Text, View } from "../components/Themed"
import { RootTabScreenProps } from "../types"

export const TodaysWordScreen: React.FC<RootTabScreenProps<"TabOne">> = ({
  navigation,
}) => {
  const [currentGuess, setCurrentGuess] = useState("")
  const [prevGuesses, setPrevGuesses] = useState<string[]>([])
  const [isNotWord, setIsNotWord] = useState(false)
  const [winToastIsVisible, setWinToastIsVisible] = useState(false)

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}
    >
      <View>
        {new Array(6).fill(0).map((_, idx) => (
          <Row
            key={idx}
            letters={
              idx === prevGuesses.length ? currentGuess : prevGuesses[idx]
            }
            locked={idx < prevGuesses.length}
            isNotWord={isNotWord && idx === prevGuesses.length}
          />
        ))}
      </View>
      <View style={{ height: "35%", backgroundColor: "red" }}>
        <Text>keyboard</Text>
      </View>
    </View>
  )
}

import React, { useContext, useState } from "react"
import { WordContext } from "../context/word-context"

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
    <View>
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
