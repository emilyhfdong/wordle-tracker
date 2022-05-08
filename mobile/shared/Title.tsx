import React from "react"
import { Text } from "react-native"

interface ITitleProps {
  text: string
}

export const Title: React.FC<ITitleProps> = ({ text }) => {
  return (
    <Text
      style={{
        fontWeight: "bold",
        fontSize: 20,
        textAlign: "center",
        marginBottom: 30,
      }}
    >
      {text}
    </Text>
  )
}
