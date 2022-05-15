import React, { useState } from "react"
import { DateTime } from "luxon"

import { useAppSelector } from "../../../redux"
import { TDayEntry, TGroupedDayEntries } from "../../../services"
import { ListItem } from "../../../shared"
import { UserIcon } from "./UserIcon"
import { DayEntry } from "./DayEntry"
import { LayoutAnimation, View, Text } from "react-native"
import { useUser } from "../../../query"
import { theme } from "../../../constants"
import { Ionicons } from "@expo/vector-icons"

type TGroupedDayEntriesProps = {
  group: TGroupedDayEntries
}

const getSubtitle = ({
  entries,
  formattedDate,
}: {
  formattedDate: string
  entries: TDayEntry[]
}) => {
  const averageAttempts = Number(
    (
      entries.reduce((acc, curr) => acc + curr.attemptsCount, 0) /
      entries.length
    ).toFixed(2)
  )
  return `${formattedDate} - avg: ${
    averageAttempts > 6 ? "X" : averageAttempts
  } / 6`
}

export const GroupedDayEntries: React.FC<TGroupedDayEntriesProps> = ({
  group: { date, entries },
}) => {
  const todaysDate = useAppSelector((state) => state.todaysWord.date)
  const [isExpanded, setIsExpanded] = useState(todaysDate === date)
  const formattedDate = DateTime.fromISO(date).toFormat("EEE, MMM d")
  const answer = entries[0]?.word.answer || ""
  const userId = useAppSelector((state) => state.user.id)
  const { data: userData } = useUser(userId)

  const { data } = useUser(userId)
  const hideAnswer = !data?.datesPlayed.includes(date) && todaysDate === date

  const sortedEntries = [...entries].sort(
    (a, b) => a.attemptsCount - b.attemptsCount
  )
  const subtitle = getSubtitle({ entries, formattedDate })

  const reversedEntries = entries.slice().reverse()

  const evenEntries = reversedEntries.filter((_, idx) => idx % 2 === 0)
  const oddEntries = reversedEntries.filter((_, idx) => idx % 2 === 1)

  const avgChange = userData?.averageChanges[date]

  return (
    <ListItem
      title={
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontWeight: "bold",
              color: theme.light.default,
            }}
          >
            {hideAnswer ? "*****" : answer}
          </Text>
          {avgChange ? (
            <View style={{ marginLeft: 5, flexDirection: "row" }}>
              <Ionicons
                color={avgChange >= 0 ? theme.light.red : theme.light.green}
                name={avgChange >= 0 ? "caret-up" : "caret-down"}
              />
              <Text
                style={{
                  color: avgChange >= 0 ? theme.light.red : theme.light.green,
                  fontSize: 10,
                  fontWeight: "bold",
                }}
              >
                {Math.abs(avgChange)}
              </Text>
            </View>
          ) : null}
        </View>
      }
      subtitle={subtitle}
      rightComponent={
        <View style={{ flexDirection: "row" }}>
          {sortedEntries.map(({ userId }) => (
            <UserIcon key={userId} userId={userId} />
          ))}
        </View>
      }
      onPress={() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
        setIsExpanded(!isExpanded)
      }}
    >
      {isExpanded && (
        <View
          style={{
            paddingTop: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
            {evenEntries.map((entry, idx) => (
              <DayEntry key={idx} {...entry} date={date} />
            ))}
          </View>
          <View>
            {oddEntries.map((entry, idx) => (
              <DayEntry key={idx} {...entry} date={date} />
            ))}
          </View>
        </View>
      )}
    </ListItem>
  )
}
