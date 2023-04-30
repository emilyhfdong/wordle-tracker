import React, { useCallback, useEffect, useMemo, useState } from "react"
import { View } from "react-native"
import { theme } from "../../constants/theme"
import { isEasyMode, isValidWord } from "../../utils"
import { todaysWordActions, useAppDispatch, useAppSelector } from "../../redux"
import { DateTime } from "luxon"
import {
  queryClient,
  QueryKeys,
  useCreateDayEntry,
  useUser,
  useWrappedStats,
} from "../../query"
import { TDayEntry } from "../../services"
import {
  Toast,
  TOTAL_WORD_FLIP_DURATION_IN_S,
  Row,
  SHAKE_DURATION_IN_S,
  BACKSPACE,
  ENTER_KEY,
  Keyboard,
  FullScreenMessage,
} from "../../shared"
import { SummaryModal } from "./components"
import { useNavigation } from "@react-navigation/native"

export const TodaysWord: React.FC = () => {
  const { currentGuess, prevGuesses, word, date, number } = useAppSelector(
    (state) => state.todaysWord
  )
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useUser(userId)
  const [summaryModalIsOpen, setSummaryModalIsOpen] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const dispatch = useAppDispatch()
  const [wordWarning, setWordWarning] = useState("")
  const [toastText, setToastText] = useState("")

  const seenWrappedSeasonNames = useAppSelector(
    (state) => state.seasons.seenWrappedSeasonNames
  )
  const { data: wrappedData } = useWrappedStats(userId)
  const { navigate, isFocused } = useNavigation()

  useEffect(() => {
    if (
      wrappedData?.sk &&
      !seenWrappedSeasonNames?.includes(wrappedData?.sk) &&
      isFocused()
    ) {
      navigate("Wrapped")
    }
  }, [wrappedData, seenWrappedSeasonNames])

  const { mutate } = useCreateDayEntry({
    onSuccess: (data) => {
      if (data.isPartiallyCompleted === false) {
        queryClient.invalidateQueries(QueryKeys.USER, { refetchInactive: true })
        queryClient.invalidateQueries(QueryKeys.FEED, { refetchInactive: true })
        queryClient.invalidateQueries(QueryKeys.FRIENDS, {
          refetchInactive: true,
        })
      }
    },
  })

  const hasAlreadyPlayed = useMemo(
    () => data?.datesPlayed.includes(date),
    [data]
  )

  useEffect(() => {
    if (data && !hasInitialized) {
      setSummaryModalIsOpen(hasAlreadyPlayed || false)
      setHasInitialized(true)
    }
  }, [hasAlreadyPlayed])

  const handleWarningToast = useCallback((message: string) => {
    setWordWarning(message)
    setTimeout(() => {
      setWordWarning("")
    }, SHAKE_DURATION_IN_S * 1000)
  }, [])

  const handleKeyboardPress = useCallback(
    (key: string) => {
      if (hasAlreadyPlayed || !word || !number) {
        return
      }

      if (key === ENTER_KEY) {
        if (currentGuess.length !== 5) {
          return
        }
        if (!isValidWord(currentGuess)) {
          handleWarningToast("Not in word list")
          return
        }
        if (isEasyMode(currentGuess, prevGuesses, word)) {
          handleWarningToast("Must use revealed hints")
          return
        }

        const allAttempts = [...prevGuesses, currentGuess]
        const dayEntry: TDayEntry = {
          attemptsCount: allAttempts.length,
          attemptsDetails: allAttempts.join(" "),
          word: { date, answer: word, number },
          createdAt: DateTime.now().toUTC().toISO(),
          userId,
          isPartiallyCompleted: false, //calculated on backend
        }
        mutate({ dayEntry, userId })

        if (word === currentGuess || prevGuesses.length === 5) {
          const failed = prevGuesses.length === 5 && word !== currentGuess
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
    },
    [
      dispatch,
      currentGuess,
      mutate,
      userId,
      prevGuesses,
      hasAlreadyPlayed,
      word,
    ]
  )

  if (!word) {
    return (
      <FullScreenMessage
        title="Whoops, something went wrong!"
        subtitle="Don't worry! Our dev devs are working on it!"
        emoji="🚧"
      />
    )
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
      {summaryModalIsOpen && (
        <SummaryModal
          isOpen={summaryModalIsOpen}
          closeModal={() => setSummaryModalIsOpen(false)}
        />
      )}
      <Toast text={wordWarning} isVisible={Boolean(wordWarning)} />
      <Toast text={toastText} isVisible={Boolean(toastText)} />
      <View style={{ flex: 1, justifyContent: "center" }}>
        {new Array(6).fill(0).map((_, idx) => (
          <Row
            correctWord={word}
            key={idx}
            letters={
              idx === prevGuesses.length ? currentGuess : prevGuesses[idx]
            }
            locked={idx < prevGuesses.length}
            isNotWord={Boolean(wordWarning) && idx === prevGuesses.length}
          />
        ))}
      </View>
      <View style={{ width: "100%" }}>
        <Keyboard onKeyPress={handleKeyboardPress} prevGuesses={prevGuesses} />
      </View>
    </View>
  )
}
