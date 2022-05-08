import React from "react"
import { View, Text } from "react-native"

type TStatisticProps = {
  label: string
  value: number
}

export const Statistic: React.FC<TStatisticProps> = ({ value, label }) => {
  return (
    <View
      style={{
        alignItems: "center",
        marginHorizontal: 10,
      }}
    >
      <Text style={{ fontSize: 35, marginBottom: 2, textAlign: "center" }}>
        {value}
      </Text>
      <Text style={{ fontSize: 12, textAlign: "center" }}>{label}</Text>
    </View>
  )
}
