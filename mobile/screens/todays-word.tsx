import React, { useEffect, useState } from "react"
import { View } from "react-native"
import { BACKSPACE, ENTER_KEY, Keyboard } from "../components/keyboard"
import { Row, SHAKE_DURATION_IN_S } from "../components/row"
import { TOTAL_WORD_FLIP_DURATION_IN_S } from "../components/tile"
import { Toast } from "../components/toast"
import { theme } from "../constants/theme"

import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { isValidWord } from "../utils/valid-words"
import { todaysWordActions } from "../redux/slices/todays-word"
import { SummaryModal } from "../components/summary-modal"
import { DateTime } from "luxon"
import { QueryKeys, useCreateDayEntry, useUser } from "../query/hooks"
import { queryClient } from "../query/client"
import { TDayEntry } from "../services/types"

export const TodaysWordScreen: React.FC = () => {
  const { currentGuess, prevGuesses, word, date, number } = useAppSelector(
    (state) => state.todaysWord
  )
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useUser(userId)
  const [summaryModalIsOpen, setSummaryModalIsOpen] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const dispatch = useAppDispatch()
  const [isNotWord, setIsNotWord] = useState(false)
  const [toastText, setToastText] = useState("")

  const { mutate } = useCreateDayEntry({
    onSuccess: () => {
      queryClient.invalidateQueries(QueryKeys.USER)
      queryClient.invalidateQueries(QueryKeys.FEED)
    },
  })

  const hasAlreadyPlayed = data?.datesPlayed.includes(date)

  useEffect(() => {
    if (data && !hasInitialized) {
      setSummaryModalIsOpen(hasAlreadyPlayed || false)
      setHasInitialized(true)
    }
  }, [hasAlreadyPlayed])

  const handleKeyboardPress = (key: string) => {
    if (hasAlreadyPlayed) {
      return
    }
    if (key === ENTER_KEY) {
      if (currentGuess.length === 5) {
        if (!isValidWord(currentGuess)) {
          setIsNotWord(true)
          setTimeout(() => {
            setIsNotWord(false)
          }, SHAKE_DURATION_IN_S * 1000)

          return
        }

        if (word === currentGuess || prevGuesses.length === 5) {
          const failed = prevGuesses.length === 5 && word !== currentGuess

          const allAttempts = [...prevGuesses, currentGuess]
          const dayEntry: TDayEntry = {
            attemptsCount: allAttempts.length,
            attemptsDetails: allAttempts.join(" "),
            word: { date, answer: word, number },
            createdAt: DateTime.now().toUTC().toISO(),
            userId,
          }
          mutate({ dayEntry, userId })
          setTimeout(() => {
            setToastText(failed ? "FAIL! 🧦" : "Impressive")
            setTimeout(() => {
              setSummaryModalIsOpen(true)
            }, 1000)
          }, TOTAL_WORD_FLIP_DURATION_IN_S * 1000)
        }
        dispatch(todaysWordActions.setCurrentGuess(""))
        dispatch(
          todaysWordActions.setPrevGuesses([...prevGuesses, currentGuess])
        )
      }
      return
    }

    if (key === BACKSPACE) {
      if (currentGuess) {
        dispatch(todaysWordActions.setCurrentGuess(currentGuess.slice(0, -1)))
      }
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
      <Toast isVisible={Boolean(toastText)}>{toastText}</Toast>
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
