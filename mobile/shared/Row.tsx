import React, { useEffect, useRef } from "react"
import { Animated } from "react-native"
import { useAppSelector } from "../redux"
import { getTiles } from "../utils"
import { Tile } from "./Tile"

export const SHAKE_DURATION_IN_S = 0.6

interface IRowProps {
  letters?: string
  locked: boolean
  isNotWord: boolean
}

export const Row: React.FC<IRowProps> = ({
  letters = "",
  locked,
  isNotWord,
}) => {
  const word = useAppSelector((state) => state.todaysWord.word)

  if (!word) {
    return <></>
  }

  const tiles = getTiles(letters, word)

  const shakeAnim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    if (isNotWord) {
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: SHAKE_DURATION_IN_S * 1000,
        useNativeDriver: true,
      }).start(() => shakeAnim.setValue(0))
    }
  })
  return (
    <Animated.View
      style={{
        flexDirection: "row",
        transform: [
          {
            translateX: shakeAnim.interpolate({
              inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
              outputRange: [0, -1, 2, -4, 4, -4, 4, -4, 2, -1, 0],
            }),
          },
        ],
      }}
    >
      {tiles.map(({ letter, color }, idx) => (
        <Tile
          locked={locked}
          letter={letter}
          key={idx}
          index={idx}
          hasWon={letters === word}
          lockedColor={color}
        />
      ))}
    </Animated.View>
  )
}
