import React from "react"
import { View, Text } from "react-native"

export const FeedEmptyState: React.FC = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 600,
      }}
    >
      <Text style={{ fontSize: 50, marginBottom: 10 }}>✨</Text>
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        Your results and your friend's results will show up here!
      </Text>
    </View>
  )
}
