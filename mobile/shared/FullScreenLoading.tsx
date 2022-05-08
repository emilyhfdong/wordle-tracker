import React from "react"
import { ActivityIndicator, View } from "react-native"
import { theme } from "../constants/theme"

export const FullScreenLoading: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: theme.light.background,
      }}
    >
      <ActivityIndicator size={"large"} />
    </View>
  )
}
