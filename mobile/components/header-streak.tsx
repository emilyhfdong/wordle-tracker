import React from "react"
import { View } from "react-native"
import { useUser } from "../query/hooks"
import { useAppSelector } from "../redux/hooks"
import { Scores } from "./scores"

export const HeaderStreak: React.FC<{}> = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useUser(userId)

  return (
    <View style={{ paddingRight: 20 }}>
      {data && (
        <Scores
          averageAttemptsCount={data?.averageAttemptsCount}
          currentStreak={data?.currentStreak}
          lastPlayedDate={data?.lastEntry?.word?.date}
        />
      )}
    </View>
  )
}
