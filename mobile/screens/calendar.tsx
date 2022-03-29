import React from "react"
import { Text, View } from "react-native"
import { theme } from "../constants/theme"
import { Calendar } from "react-native-calendars"
import { useAppSelector } from "../redux/hooks"
import { IDayEntry } from "../redux/slices/day-entries.slice"

interface ICalendarProps {}

const getMarkedDates = (dayEntries: IDayEntry[]) => {
  const color = theme.light.yellow
  return dayEntries.reduce(
    (acc, curr) => ({ ...acc, [curr.word.date]: { periods: [{ color }] } }),
    {}
  )
}

export const CalendarScreen: React.FC<ICalendarProps> = () => {
  const dayEntries = useAppSelector((state) => state.dayEntries)
  const markedDates = getMarkedDates(dayEntries)
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.light.background,
        position: "relative",
        paddingTop: 70,
      }}
    >
      <Calendar
        // displayLoadingIndicator
        theme={{
          todayTextColor: theme.light.green,
          arrowColor: theme.light.green,
          dayTextColor: theme.light.grey,
          textDayFontFamily: "System",
          textMonthFontFamily: "System",
          textDayHeaderFontFamily: "System",
          textDayFontWeight: "bold",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "bold",
        }}
        style={{ width: "100%" }}
        markingType="multi-period"
        current="2022-03-27"
        markedDates={markedDates}
      />
    </View>
  )
}
