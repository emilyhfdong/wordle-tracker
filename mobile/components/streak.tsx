import React from "react"
import { View, Text } from "react-native"
import { theme } from "../constants/theme"
import FireIcon from "../assets/images/fire.svg"

interface IStreakProps {
  currentStreak: number
}

export const Streak: React.FC<IStreakProps> = ({ currentStreak }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
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
