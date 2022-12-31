import React from "react"
import { Text } from "react-native"
import { FadeInView } from "./FadeInView"

type AnimatedTitleProps = {
  text: string
}

export const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ text }) => {
  return (
    <FadeInView order={0}>
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
        }}
      >
        {text}
      </Text>
    </FadeInView>
  )
}
