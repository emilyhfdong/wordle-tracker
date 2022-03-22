import React, { useContext, useState } from "react"
import { View } from "react-native"
import { BACKSPACE, ENTER_KEY, Keyboard } from "../components/keyboard"
import { Row, SHAKE_DURATION_IN_S } from "../components/row"
import { getTileColor, TOTAL_WORD_FLIP_DURATION_IN_S } from "../components/tile"
import { Toast } from "../components/toast"
import { theme } from "../constants/theme"

import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { RootTabScreenProps } from "../types"
import { isValidWord } from "../utils/valid-words"
import { todaysWordActions } from "../redux/slices/todays-word"
import { SummaryModal } from "../components/summary-modal"
import { dayEntriesActions } from "../redux/slices/day-entries.slice"

const tileColorToCode = {
  [theme.light.yellow]: "1",
  [theme.light.green]: "2",
  [theme.light.grey]: "0",
}

const getAttemptsDetails = (guesses: string[], word: string) => {
  return guesses
    .map(
      (guess) =>
        `${guess
          .split("")
          .map(
            (letter, index) =>
              tileColorToCode[getTileColor({ index, letter, word })]
          )
          .join("")}`
    )
    .join(" ")
}

export const TodaysWordScreen: React.FC<RootTabScreenProps<"TabOne">> = ({
  navigation,
}) => {
  const { currentGuess, prevGuesses, word, date, number } = useAppSelector(
    (state) => state.todaysWord
  )
  const lastDayEntry = useAppSelector((state) => state.dayEntries[0])

  const [summaryModalIsOpen, setSummaryModalIsOpen] = useState(
    lastDayEntry?.date === date
  )
  const dispatch = useAppDispatch()
  const [isNotWord, setIsNotWord] = useState(false)
  const [winToastIsVisible, setWinToastIsVisible] = useState(false)

  const handleKeyboardPress = (key: string) => {
    if (key === ENTER_KEY && currentGuess.length === 5) {
      if (!isValidWord(currentGuess)) {
        setIsNotWord(true)
        setTimeout(() => setIsNotWord(false), SHAKE_DURATION_IN_S * 1000)
        return
      }
      if (word === currentGuess) {
        setTimeout(() => {
          const allAttempts = [...prevGuesses, currentGuess]
          setWinToastIsVisible(true)
          setTimeout(() => {
            setSummaryModalIsOpen(true)
            dispatch(
              dayEntriesActions.addDayEntry({
                attemptsCount: allAttempts.length,
                attemptsDetails: getAttemptsDetails(allAttempts, currentGuess),
                date,
                word,
                number,
              })
            )
          }, 1000)
        }, TOTAL_WORD_FLIP_DURATION_IN_S * 1000)
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
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: theme.light.background,
        position: "relative",
      }}
    >
      <SummaryModal
        isOpen={summaryModalIsOpen}
        closeModal={() => setSummaryModalIsOpen(false)}
      />
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
  )
}
