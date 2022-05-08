import React from "react"
import { View, Text } from "react-native"

import { theme } from "../../../constants"
import { useAppSelector } from "../../../redux"
import { useUser } from "../../../query"
import { getTileColor } from "../../../shared"

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
  const hasPlayedThisDay = data?.datesPlayed.includes(date)
  const hideAnswer = !hasPlayedThisDay && todaysDate === date

  return (
    <View>
      {attemptsDetail.split(" ").map((attemptWord, wordIdx) => (
        <View key={wordIdx} style={{ flexDirection: "row" }}>
          {attemptWord.split("").map((letter, index) => (
            <View
              style={{
                backgroundColor: hideAnswer
                  ? theme.light.grey
                  : getTileColor({ letter, word, index }),
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
                  fontSize: 15,
                }}
              >
                {hideAnswer ? "" : letter}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}
