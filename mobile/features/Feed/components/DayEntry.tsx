import React from "react"
import { View, Text } from "react-native"
import { DateTime } from "luxon"

import { theme } from "../../../constants"
import { useAppSelector } from "../../../redux"
import { useFriends } from "../../../query"
import { TDayEntry } from "../../../services"
import { DayEntryBoard } from "./DayEntryBoard"

export const DayEntry: React.FC<TDayEntry & { date: string }> = ({
  userId,
  word,
  attemptsDetails,
  createdAt,
  date,
  attemptsCount,
}) => {
  const authUser = useAppSelector((state) => state.user)
  const isSelf = useAppSelector((state) => state.user.id === userId)
  const { data } = useFriends(authUser.id)

  if (!data || (!data[userId] && !isSelf)) {
    return null
  }
  const friend = data[userId]

  const color = isSelf ? theme.light.grey : friend.color

  return (
    <View>
      <View
        style={{
          marginTop: 10,
          borderColor: "#E6E6E6",
          borderWidth: 1,
          borderRadius: 5,
          paddingVertical: 6,
          paddingHorizontal: 6,
          backgroundColor: theme.light.background,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color,
            }}
          >
            {isSelf ? authUser.name : friend.name}
          </Text>
          <Text style={{ color: theme.light.grey, fontSize: 12 }}>
            {attemptsCount <= 6 ? attemptsCount : "X"} / 6
          </Text>
        </View>
        <DayEntryBoard
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
