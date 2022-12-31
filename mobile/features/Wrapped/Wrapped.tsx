import React from "react"
import { View, Text } from "react-native"
import { BarChart, XAxis } from "react-native-svg-charts"
import { theme } from "../../constants"
import { useWrappedStats } from "../../query"
import { useAppSelector } from "../../redux"
import { Row } from "../../shared"
import { WrappedLayout } from "./WrappedLayout"
import * as scale from "d3-scale"
import { getMostCommonTimeOfDay } from "./utils"
import { DayEntryBoard } from "../Feed/components/DayEntryBoard"
import { DateTime } from "luxon"

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
      nextScreen="YellowMistakes"
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
            formatLabel={(_value, index) => {
              const hour: number = Number(hours[index])
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

export const YellowMistakes: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useWrappedStats(userId)

  if (!data) {
    return <></>
  }

  const yellowMistakes = data.stats.sameYellowPositionMistakes

  return (
    <WrappedLayout
      fullTitle={`You've ignored the yellow tile hint ${
        yellowMistakes.length
      } time${yellowMistakes.length ? "s" : ""}!`}
      title={`Missed yellow tile opportunities:`}
      nextScreen="Landing"
    >
      <View
        style={{
          marginTop: 30,
          alignItems: "center",
          flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-around",
        }}
      >
        {yellowMistakes.map((dayEntry, idx) => (
          <View style={{ marginBottom: 5 }}>
            <Text style={{ color: theme.light.grey, fontSize: 10 }}>
              {DateTime.fromISO(dayEntry.word.date).toFormat("EEE, MMM d")}
            </Text>
            <DayEntryBoard
              key={idx}
              word={dayEntry.word.answer}
              attemptsDetail={dayEntry.attemptsDetails}
              date={dayEntry.word.date}
            />
          </View>
        ))}
      </View>
    </WrappedLayout>
  )
}
