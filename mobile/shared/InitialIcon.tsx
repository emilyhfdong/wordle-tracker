import React from "react"
import { View, Text } from "react-native"

type InitialIconProps = {
  name: string
  color: string
}

export const InitialIcon: React.FC<InitialIconProps> = ({ name, color }) => {
  return (
    <View
      style={{
        backgroundColor: color,
        height: 12,
        width: 12,
        borderRadius: 6,
        marginLeft: 3,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 7, color: "white", fontWeight: "bold" }}>
        {name[0].toUpperCase()}
      </Text>
    </View>
  )
}
