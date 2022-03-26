import React from "react"
import { View } from "react-native"
import { useAppSelector } from "../redux/hooks"
import { Streak } from "./streak"
import { getCurrentStreak } from "./summary-modal"

export const HeaderStreak: React.FC<{}> = () => {
  const date = useAppSelector((state) => state.todaysWord.date)
  const currentStreak = useAppSelector((state) =>
    getCurrentStreak(state.dayEntries, date)
  )
  return (
    <View style={{ paddingRight: 20 }}>
      <Streak currentStreak={currentStreak} />
    </View>
  )
}
