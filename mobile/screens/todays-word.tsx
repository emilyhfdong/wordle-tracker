import React, { useContext, useState } from "react"
import { View } from "react-native"
import { BACKSPACE, ENTER_KEY, Keyboard } from "../components/keyboard"
import { Row, SHAKE_DURATION_IN_S } from "../components/row"
import { TOTAL_WORD_FLIP_DURATION_IN_S } from "../components/tile"
import { Toast } from "../components/toast"
import { theme } from "../constants/theme"

import { WordContext } from "../context/word-context"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { RootTabScreenProps } from "../types"
import { isValidWord } from "../utils/valid-words"
import { todaysWordActions } from "../redux/slices/todays-word"

export const TodaysWordScreen: React.FC<
  RootTabScreenProps<"TabOne">
> = ({}) => {
  const currentGuess = useAppSelector((state) => state.todaysWord.currentGuess)
  const prevGuesses = useAppSelector((state) => state.todaysWord.prevGuesses)
  const dispatch = useAppDispatch()
  const [isNotWord, setIsNotWord] = useState(false)
  const [winToastIsVisible, setWinToastIsVisible] = useState(false)
  const word = useContext(WordContext)

  const handleKeyboardPress = (key: string) => {
    if (key === ENTER_KEY && currentGuess.length === 5) {
      if (!isValidWord(currentGuess)) {
        setIsNotWord(true)
        setTimeout(() => setIsNotWord(false), SHAKE_DURATION_IN_S * 1000)
        return
      }
      if (word === currentGuess) {
        setTimeout(
          () => setWinToastIsVisible(true),
          TOTAL_WORD_FLIP_DURATION_IN_S * 1000
        )
      }
      dispatch(todaysWordActions.setCurrentGuess(""))
      dispatch(todaysWordActions.setPrevGuesses([...prevGuesses, currentGuess]))
      return
    }

    if (key === BACKSPACE && currentGuess.length <= 5) {
      dispatch(todaysWordActions.setCurrentGuess(currentGuess.slice(0, -1)))
      return
    }
    if (currentGuess.length < 5) {
      dispatch(todaysWordActions.setCurrentGuess(currentGuess + key))
    }
  }

  return word ? (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.light.background,
        position: "relative",
      }}
    >
      <Toast isVisible={isNotWord}>Not in word list</Toast>
      <Toast isVisible={winToastIsVisible}>Impressive</Toast>
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
      <View style={{ width: "100%" }}>
        <Keyboard onKeyPress={handleKeyboardPress} prevGuesses={prevGuesses} />
      </View>
    </View>
  ) : null
}
