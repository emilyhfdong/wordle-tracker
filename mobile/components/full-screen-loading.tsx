import React from "react"
import { ActivityIndicator, View } from "react-native"
import { theme } from "../constants/theme"

interface IFullScreenLoadingProps {}

export const FullScreenLoading: React.FC<IFullScreenLoadingProps> = () => {
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
