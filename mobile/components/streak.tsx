import React from "react"
import { View, Text } from "react-native"
import { theme } from "../constants/theme"
import FireIcon from "../assets/images/fire.svg"
import { useAppSelector } from "../redux/hooks"

interface IStreakProps {
  currentStreak: number
  lastPlayedDate: string
}

export const Streak: React.FC<IStreakProps> = ({
  currentStreak,
  lastPlayedDate,
}) => {
  const todaysDate = useAppSelector((state) => state.todaysWord.date)
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        opacity: currentStreak && todaysDate !== lastPlayedDate ? 0.5 : 1,
      }}
    >
      <Text
        style={{
          marginRight: 4,
          fontWeight: "bold",
          color: currentStreak ? "#e85a5a" : theme.light.grey,
          textAlignVertical: "center",
          paddingTop: 3,
        }}
      >
        {currentStreak}
      </Text>
      <FireIcon fill={currentStreak ? "#e85a5a" : theme.light.grey} />
    </View>
  )
}
