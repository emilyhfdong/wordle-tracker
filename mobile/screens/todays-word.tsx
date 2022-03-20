import React, { useContext, useState } from "react"
import { View, Text } from "react-native"
import { Row } from "../components/row"

import { WordContext } from "../context/word-context"
import { RootTabScreenProps } from "../types"

export const TodaysWordScreen: React.FC<RootTabScreenProps<"TabOne">> = ({
  navigation,
}) => {
  const [currentGuess, setCurrentGuess] = useState("")
  const [prevGuesses, setPrevGuesses] = useState<string[]>([])
  const [isNotWord, setIsNotWord] = useState(false)
  const [winToastIsVisible, setWinToastIsVisible] = useState(false)
  const word = useContext(WordContext)

  return word ? (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}
    >
      <View style={{ flex: 1, justifyContent: "center" }}>
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
      <View style={{ height: "35%" }}>
        <Text>keyboard</Text>
      </View>
    </View>
  ) : null
}
