import React from "react"
import { View } from "react-native"
import { useAppSelector } from "../redux/hooks"
import { Scores } from "./scores"
import { getCurrentStreak } from "./summary-modal"

export const HeaderStreak: React.FC<{}> = () => {
  const date = useAppSelector((state) => state.todaysWord.date)
  const currentStreak = useAppSelector((state) =>
    getCurrentStreak(state.dayEntries, date)
  )
  const lastPlayedDate = useAppSelector(
    (state) => state.dayEntries[0]?.word.date
  )
  const userId = useAppSelector((state) => state.user.id)
  const averageAttemptsCount = useAppSelector((state) =>
    state.feed.friends ? state.feed.friends[userId].averageAttemptsCount : null
  )
  return (
    <View style={{ paddingRight: 20 }}>
      <Scores
        averageAttemptsCount={averageAttemptsCount}
        currentStreak={currentStreak}
        lastPlayedDate={lastPlayedDate}
      />
    </View>
  )
}
