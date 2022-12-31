import React from "react"
import { View, Text } from "react-native"
import { BarChart, XAxis } from "react-native-svg-charts"
import { theme } from "../../constants"
import { useWrappedStats } from "../../query"
import { useAppSelector } from "../../redux"
import { Row } from "../../shared"
import { WrappedLayout } from "./WrappedLayout"
import * as scale from "d3-scale"

type WrappedProps = {}

export const Wrapped: React.FC<WrappedProps> = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useWrappedStats(userId)

  if (!data) {
    return null
  }

  return (
    <WrappedLayout
      fullTitle={` Your Season ${
        data.sk.split("#").slice(-1)[0]
      } Wordzle Recap!!`}
      title={` Your Season ${data.sk.split("#").slice(-1)[0]} Wordzle Recap!!`}
      nextScreen="MostCommonWords"
    ></WrappedLayout>
  )
}

export const MostCommonWords: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useWrappedStats(userId)

  return (
    <WrappedLayout
      fullTitle={`You made ${data?.stats.uniqueGuessesCount} different guesses this season!\n\nThese are the ones you keep coming back to:`}
      title={`Your most common guesses:`}
      nextScreen="MostCommonTime"
    >
      <View
        style={{
          marginTop: 30,
          alignItems: "center",
          flex: 1,
        }}
      >
        {data?.stats.top5Guesses.map(({ guess, count }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
              width: "100%",
              marginBottom: 10,
            }}
          >
            <Row
              correctWord={guess}
              isNotWord={false}
              locked={true}
              letters={guess}
            />
            <Text style={{ marginLeft: 5, fontSize: 16, fontWeight: "500" }}>
              {count}x
            </Text>
          </View>
        ))}
      </View>
    </WrappedLayout>
  )
}

const getMostCommonTimeOfDay = (
  hourOccuranceMap:
    | {
        [hour: string]: number
      }
    | undefined
) => {
  if (!hourOccuranceMap) {
    return ""
  }
  const timesOfDay = {
    "early morning": 0,
    morning: 0,
    afternoon: 0,
    night: 0,
  }

  for (let hour in hourOccuranceMap) {
    const occurance = hourOccuranceMap[hour]
    if (occurance < 6) {
      timesOfDay["early morning"] += occurance
    } else if (occurance < 12) {
      timesOfDay.morning += occurance
    } else if (occurance < 18) {
      timesOfDay.afternoon += occurance
    } else {
      timesOfDay.night += occurance
    }
  }

  return (Object.keys(timesOfDay) as (keyof typeof timesOfDay)[]).reduce(
    (acc, curr) => (timesOfDay[acc] > timesOfDay[curr] ? acc : curr),
    "early morning" as keyof typeof timesOfDay
  )
}

export const MostCommonTime: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useWrappedStats(userId)

  if (!data) {
    return <></>
  }

  const hours = Object.keys(data?.stats.hourOccuranceMap).sort(
    (a, b) => Number(a) - Number(b)
  )

  return (
    <WrappedLayout
      fullTitle={`You are a ${getMostCommonTimeOfDay(
        data?.stats.hourOccuranceMap
      )} wordzle person!`}
      title={`You've been playing wordzle at these times:`}
      nextScreen="Landing"
    >
      <View
        style={{
          marginBottom: 30,
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View style={{ height: 250, width: "100%" }}>
          <BarChart
            style={{ flex: 1 }}
            data={hours.map((hour) => data.stats.hourOccuranceMap[hour])}
            svg={{ fill: theme.light.green }}
            yMin={0}
          />
          <XAxis
            style={{ marginTop: 10 }}
            data={hours}
            scale={scale.scaleBand}
            formatLabel={(value, index) => {
              const hour = Number(hours[index])
              return `${hour % 12 === 0 ? "12" : hour % 12}${
                hour < 12 ? "am" : "pm"
              }`
            }}
            svg={{ fontSize: 8, fill: theme.light.grey }}
          />
        </View>
      </View>
    </WrappedLayout>
  )
}
