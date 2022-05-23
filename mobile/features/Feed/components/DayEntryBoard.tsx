import React from "react"
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
  const hasPlayedThisDay = data?.datesPlayed.includes(date)
  const hideAnswer = !hasPlayedThisDay && todaysDate === date

  return (
    <View>
      {attemptsDetail.split(" ").map((attemptWord, wordIdx) => (
        <View key={wordIdx} style={{ flexDirection: "row" }}>
          {getTiles(attemptWord, word).map(({ letter, color }, index) => (
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
                {hideAnswer ? "" : letter}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}
