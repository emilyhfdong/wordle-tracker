import React, { useCallback, useMemo, useState } from "react"
import { DateTime } from "luxon"

import { useAppSelector } from "../../../redux"
import { TDayEntry, TGroupedDayEntries } from "../../../services"
import { UserIcon } from "./UserIcon"
import { View, Text } from "react-native"
import { useUser } from "../../../query"
import { theme } from "../../../constants"
import { Ionicons } from "@expo/vector-icons"
import { ExpandableListItem } from "../../../shared"
import { DayEntryBoards } from "./DayEntryBoards"

type TGroupedDayEntriesProps = {
  group: TGroupedDayEntries
  isAlwaysExpanded?: boolean
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

export const _GroupedDayEntries: React.FC<TGroupedDayEntriesProps> = ({
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

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => a.attemptsCount - b.attemptsCount),
    [entries]
  )
  const subtitle = getSubtitle({ entries, formattedDate })

  const avgChange = userData?.averageChanges[date]
  const renderRightComponent = useCallback(
    () => (
      <View style={{ flexDirection: "row" }}>
        {sortedEntries.map(({ userId }) => (
          <UserIcon key={userId} userId={userId} />
        ))}
      </View>
    ),
    [entries]
  )

  return (
    <ExpandableListItem
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
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
      renderRightComponent={renderRightComponent}
    >
      {isExpanded && <DayEntryBoards date={date} entries={entries} />}
    </ExpandableListItem>
  )
}

export const GroupedDayEntries = React.memo(_GroupedDayEntries)
