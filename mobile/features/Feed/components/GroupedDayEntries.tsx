import React, { useState } from "react"
import { DateTime } from "luxon"

import { useAppSelector } from "../../../redux"
import { TDayEntry, TGroupedDayEntries } from "../../../services"
import { ListItem } from "../../../shared"
import { UserIcon } from "./UserIcon"
import { DayEntry } from "./DayEntry"
import { LayoutAnimation, View } from "react-native"
import { useUser } from "../../../query"

type TGroupedDayEntriesProps = {
  group: TGroupedDayEntries
}

const getSubtitle = ({
  entries,
  answer,
  hideAnswer,
}: {
  answer: string
  entries: TDayEntry[]
  hideAnswer: boolean
}) => {
  const averageAttempts = Number(
    (
      entries.reduce((acc, curr) => acc + curr.attemptsCount, 0) /
      entries.length
    ).toFixed(2)
  )
  const avgStr = `avg: ${averageAttempts > 6 ? "X" : averageAttempts} / 6`
  return hideAnswer ? avgStr : `${answer} - ${avgStr}`
}

export const GroupedDayEntries: React.FC<TGroupedDayEntriesProps> = ({
  group: { date, entries },
}) => {
  const todaysDate = useAppSelector((state) => state.todaysWord.date)
  const [isExpanded, setIsExpanded] = useState(todaysDate === date)
  const formattedDate = DateTime.fromISO(date).toFormat("EEE, MMM d")
  const answer = entries[0]?.word.answer || ""
  const userId = useAppSelector((state) => state.user.id)

  const { data } = useUser(userId)
  const hideAnswer = !data?.datesPlayed.includes(date) && todaysDate === date

  const sortedEntries = entries.sort(
    (a, b) => a.attemptsCount - b.attemptsCount
  )
  const subtitle = getSubtitle({ entries, answer, hideAnswer })

  return (
    <ListItem
      title={`${formattedDate}`}
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
            paddingTop: 5,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {entries.map((entry, idx) => (
            <DayEntry key={idx} {...entry} date={date} />
          ))}
        </View>
      )}
    </ListItem>
  )
}
