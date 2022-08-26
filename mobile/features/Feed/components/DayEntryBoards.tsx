import React, { useMemo } from "react"
import { View } from "react-native"
import { TGroupedDayEntries } from "../../../services"
import { DayEntry } from "./DayEntry"

type DayEntryBoardsProps = {
  entries: TGroupedDayEntries["entries"]
  date: TGroupedDayEntries["date"]
}

export const _DayEntryBoards: React.FC<DayEntryBoardsProps> = ({
  entries,
  date,
}) => {
  const reversedEntries = useMemo(() => entries.slice().reverse(), entries)

  const evenEntries = useMemo(
    () => reversedEntries.filter((_, idx) => idx % 2 === 0),
    [reversedEntries]
  )
  const oddEntries = useMemo(
    () => reversedEntries.filter((_, idx) => idx % 2 === 1),
    [reversedEntries]
  )

  return (
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
  )
}
export const DayEntryBoards = React.memo(_DayEntryBoards)
