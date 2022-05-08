import { DateTime, Settings } from "luxon"
import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"

export const NextWordzle: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(DateTime.now())
  const nextWordzleTime = DateTime.now().endOf("day").plus({ minutes: 3 })

  useEffect(() => {
    Settings.defaultZone = "America/Toronto"

    const interval = setInterval(() => {
      setCurrentTime(DateTime.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}>
        NEXT WORDLE
      </Text>
      <Text style={{ fontSize: 33 }}>
        {nextWordzleTime.diff(currentTime).toFormat("hh:mm:ss")}
      </Text>
    </View>
  )
}
