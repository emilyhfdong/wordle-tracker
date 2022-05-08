import React, { useEffect, useRef } from "react"
import { Text, Animated } from "react-native"
import { theme } from "../constants"

interface IToastProps {
  isVisible: boolean
}

export const Toast: React.FC<IToastProps> = ({ children, isVisible }) => {
  const opacity = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (isVisible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start()
    } else {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        delay: 500,
      }).start()
    }
  }, [isVisible])
  return (
    <Animated.View
      style={{
        position: "absolute",
        backgroundColor: theme.light.default,
        zIndex: 1,
        top: 50,
        padding: 15,
        borderRadius: 5,
        opacity,
      }}
    >
      <Text style={{ color: theme.light.background, fontWeight: "bold" }}>
        {children}
      </Text>
    </Animated.View>
  )
}
