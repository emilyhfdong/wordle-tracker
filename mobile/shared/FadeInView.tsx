import React, { PropsWithChildren, useEffect, useRef } from "react"
import { Animated } from "react-native"

type FadeInViewProps = {
  order: number
}

export const FadeInView: React.FC<PropsWithChildren<FadeInViewProps>> = ({
  order = 1,
  children,
}) => {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(10)).current

  useEffect(() => {
    Animated.spring(opacity, {
      toValue: 1,
      useNativeDriver: true,
      delay: 500 * order,
    }).start()
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
      delay: 500 * order,
    }).start()
  }, [])

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
      }}
    >
      {children}
    </Animated.View>
  )
}
