import React from "react"
import { ActivityIndicator, View } from "react-native"

interface IFullScreenLoadingProps {}

export const FullScreenLoading: React.FC<IFullScreenLoadingProps> = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size={"large"} />
    </View>
  )
}
