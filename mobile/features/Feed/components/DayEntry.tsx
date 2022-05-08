import React from "react"
import { View, Text } from "react-native"
import { DateTime } from "luxon"

import { theme } from "../../../constants"
import { useAppSelector } from "../../../redux"
import { useFriends } from "../../../query"
import { TDayEntry } from "../../../services"
import { Board } from "./GroupedDayEntries"

export const DayEntry: React.FC<TDayEntry & { date: string }> = ({
  userId,
  word,
  attemptsDetails,
  createdAt,
  date,
  attemptsCount,
}) => {
  const selfUserId = useAppSelector((state) => state.user.id)
  const isSelf = useAppSelector((state) => state.user.id === userId)
  const { data } = useFriends(selfUserId)

  if (!data) {
    return null
  }
  const friend = data[userId]

  return (
    <View
      style={{
        width: "100%",
        alignItems: isSelf ? "flex-end" : "flex-start",
      }}
    >
      <View
        style={{
          marginTop: 10,
          borderColor: "#E6E6E6",
          borderWidth: 1,
          borderRadius: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          backgroundColor: theme.light.background,
        }}
      >
        <View
          style={{
            flexDirection: isSelf ? "row-reverse" : "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: isSelf ? theme.light.grey : friend.color,
              textAlign: isSelf ? "right" : "left",
            }}
          >
            {isSelf ? self.name : friend.name}
          </Text>
          <Text style={{ color: theme.light.grey, fontSize: 12 }}>
            {attemptsCount <= 6 ? attemptsCount : "X"} / 6
          </Text>
        </View>
        <Board
          word={word.answer}
          attemptsDetail={attemptsDetails}
          date={date}
        />
        <Text
          style={{
            color: theme.light.grey,
            marginTop: 7,
            textAlign: "right",
            fontSize: 10,
          }}
        >
          {DateTime.fromISO(createdAt).toFormat("t")}
        </Text>
      </View>
    </View>
  )
}
