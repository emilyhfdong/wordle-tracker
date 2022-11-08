import React, { useMemo } from "react"
import { View, Text } from "react-native"

import { theme } from "../../../constants"
import { useAppSelector } from "../../../redux"
import { useUser } from "../../../query"
import { getTiles } from "../../../utils"

type TDayEntryBoardProps = {
  attemptsDetail: string
  word: string
  date: string
}

export const DayEntryBoard: React.FC<TDayEntryBoardProps> = ({
  word,
  attemptsDetail,
  date,
}) => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useUser(userId)
  const todaysDate = useAppSelector((state) => state.todaysWord.date)
  const hasPlayedThisDay = useMemo(
    () => data?.datesPlayed.includes(date),
    [data, date]
  )
  const hideAnswer = !hasPlayedThisDay && todaysDate === date

  const words = useMemo(() => attemptsDetail.split(" "), [attemptsDetail])

  return (
    <View>
      {(hideAnswer ? ["?????"] : words).map((attemptWord, wordIdx) => (
        <EntryRow
          key={wordIdx}
          attemptWord={attemptWord}
          word={word}
          hideAnswer={hideAnswer}
        />
      ))}
    </View>
  )
}

export const EntryRow: React.FC<{
  attemptWord: string
  word: string
  hideAnswer: boolean
}> = ({ attemptWord, word, hideAnswer }) => {
  const tiles = useMemo(() => getTiles(attemptWord, word), [attemptWord, word])

  return (
    <View style={{ flexDirection: "row" }}>
      {tiles.map(({ letter, color }, index) => (
        <View
          style={{
            backgroundColor: hideAnswer ? theme.light.grey : color,
            height: 26,
            width: 26,
            margin: 1.5,
            justifyContent: "center",
            alignItems: "center",
          }}
          key={index}
        >
          <Text
            style={{
              color: theme.light.background,
              fontWeight: "bold",
              fontSize: 13,
            }}
          >
            {hideAnswer ? "?" : letter}
          </Text>
        </View>
      ))}
    </View>
  )
}
