import React, { useMemo } from "react"
import { View, Text } from "react-native"
import { DateTime } from "luxon"

import { theme } from "../../../constants"
import { useAppSelector } from "../../../redux"
import { useFriends, useUser } from "../../../query"
import { TDayEntry } from "../../../services"
import { DayEntryBoard } from "./DayEntryBoard"
import { getScoreDisplay } from "./utils"
import { AverageChange } from "./AverageChange"

export const DayEntry: React.FC<TDayEntry & { date: string }> = ({
  userId,
  word,
  attemptsDetails,
  createdAt,
  date,
  attemptsCount,
  isPartiallyCompleted,
}) => {
  const authUser = useAppSelector((state) => state.user)
  const isSelf = useAppSelector((state) => state.user.id === userId)
  const { data } = useFriends(authUser.id)
  const { data: userData } = useUser(authUser.id)
  const hasPlayedThisDay = useMemo(
    () => Boolean(userData?.datesPlayed.includes(date)),
    [data, userData]
  )

  if (!data || (!data[userId] && !isSelf)) {
    return null
  }
  const friend = data[userId]

  const color = isSelf ? theme.light.grey : friend.color

  if (isSelf && isPartiallyCompleted) {
    return null
  }

  return (
    <View style={{ opacity: isPartiallyCompleted ? 0.5 : 1 }}>
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
            alignItems: "center",
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
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {hasPlayedThisDay && (
              <AverageChange change={friend?.averageChanges[date]} />
            )}
            <Text
              style={{ color: theme.light.grey, fontSize: 12, marginLeft: 8 }}
            >
              {getScoreDisplay({
                hasPlayedThisDay,
                attemptsCount,
                isPartiallyCompleted,
              })}
            </Text>
          </View>
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
