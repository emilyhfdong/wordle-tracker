import React from "react"
import { View, Text } from "react-native"
import { RW } from "../utils"

type FullScreenMessageProps = {
  title: string
  emoji: string
  subtitle?: string
}

export const FullScreenMessage: React.FC<FullScreenMessageProps> = ({
  emoji,
  title,
  subtitle,
}) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 600,
        paddingHorizontal: RW(10),
        backgroundColor: "#F9F9F9",
      }}
    >
      <Text style={{ fontSize: 50, marginBottom: 10 }}>{emoji}</Text>
      <Text
        style={{
          fontSize: 20,
          textAlign: "center",
          marginBottom: 10,
          fontWeight: "500",
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{
            fontSize: 16,
            textAlign: "center",
            paddingHorizontal: 30,
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  )
}
