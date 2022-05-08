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
  const isTodaysWordAndHaventPlayed = !hasPlayedThisDay && todaysDate === date

  return (
    <View>
      {attemptsDetail.split(" ").map((attemptWord, wordIdx) => (
        <View key={wordIdx} style={{ flexDirection: "row" }}>
          {attemptWord.split("").map((letter, index) => (
            <View
              style={{
                backgroundColor: !isTodaysWordAndHaventPlayed
                  ? getTileColor({ letter, word, index })
                  : theme.light.grey,
                height: 35,
                width: 35,
                margin: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
              key={index}
            >
              <Text
                style={{
                  color: theme.light.background,
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                {hasPlayedThisDay ? letter : ""}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}
