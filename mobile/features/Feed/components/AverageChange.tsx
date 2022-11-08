import React from "react"
import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { theme } from "../../../constants"

type AverageChangeProps = {
  change: number | undefined
}

export const AverageChange: React.FC<AverageChangeProps> = ({ change }) => {
  if (!change) {
    return null
  }
  return (
    <View style={{ marginLeft: 5, flexDirection: "row", alignItems: "center" }}>
      <Ionicons
        color={change >= 0 ? theme.light.red : theme.light.green}
        name={change >= 0 ? "caret-up" : "caret-down"}
      />
      <Text
        style={{
          color: change >= 0 ? theme.light.red : theme.light.green,
          fontSize: 10,
          fontWeight: "bold",
        }}
      >
        {Math.abs(change)}
      </Text>
    </View>
  )
}
