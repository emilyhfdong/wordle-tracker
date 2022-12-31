import React, { useEffect } from "react"
import { View, Text, ScrollView } from "react-native"
import { BarChart, YAxis } from "react-native-svg-charts"
import { theme } from "../../constants"
import { useFriends, useWrappedStats } from "../../query"
import { useAppSelector } from "../../redux"
import { Row, TwoColumnLayout } from "../../shared"
import { WrappedLayout } from "./WrappedLayout"
import * as scale from "d3-scale"
import { getMostCommonTimeOfDay } from "./utils"
import { DayEntryBoard } from "../Feed/components/DayEntryBoard"
import { DateTime } from "luxon"
import { useDispatch } from "react-redux"
import { seasonsActions } from "../../redux/slices/seasons"

type WrappedProps = {}

export const Wrapped: React.FC<WrappedProps> = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useWrappedStats(userId)
  const seenWrappedSeasonNames = useAppSelector(
    (state) => state.seasons.seenWrappedSeasonNames
  )
  const dispatch = useDispatch()

  useEffect(() => {
    if (data && !seenWrappedSeasonNames?.includes(data.sk)) {
      dispatch(seasonsActions.addWrappedSeasonName(data?.sk))
    }
  }, [data])

  if (!data) {
    return null
  }

  return (
    <WrappedLayout
      noBack
      fullTitle={`Your Season ${
        data.sk.split("#").slice(-1)[0]
      } **Wordzle Wrapped** has arrived!!`}
      accentColor="green"
      nextScreen="MostCommonWords"
    ></WrappedLayout>
  )
}

export const MostCommonWords: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useWrappedStats(userId)

  return (
    <WrappedLayout
      fullTitle={`You made **${data?.stats.uniqueGuessesCount} different guesses** this season!\n\nThese are the ones you keep coming back to:`}
      accentColor="green"
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
      fullTitle={`You are a **${getMostCommonTimeOfDay(
        data?.stats.hourOccuranceMap
      )}** wordzle person!`}
      accentColor="orange"
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
        <View style={{ height: 300, width: "100%", flexDirection: "row" }}>
          <YAxis
            style={{ marginRight: 5 }}
            data={hours}
            scale={scale.scaleBand}
            formatLabel={(_value, index) => {
              const hour: number = Number(hours[index])
              return `${hour % 12 === 0 ? "12" : hour % 12}${
                hour < 12 ? " am" : " pm"
              }`
            }}
            svg={{ fontSize: 10, fill: theme.light.grey }}
          />
          <BarChart
            style={{ flex: 1 }}
            data={hours.map((hour) => data.stats.hourOccuranceMap[hour])}
            svg={{ fill: theme.light.orange }}
            yMin={0}
            horizontal
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

  if (!yellowMistakes.length) {
    return (
      <WrappedLayout
        fullTitle="Congrats! you've never ignored the **yellow** tile hint!"
        accentColor="yellow"
        nextScreen="ExistingWordMistakes"
      />
    )
  }

  return (
    <WrappedLayout
      fullTitle={`You've ignored the **yellow** tile hint ${
        yellowMistakes.length
      } time${yellowMistakes.length > 1 ? "s" : ""}!`}
      accentColor="yellow"
      title={`Missed yellow tile opportunities:`}
      nextScreen="ExistingWordMistakes"
    >
      <TwoColumnLayout
        data={yellowMistakes}
        renderItem={(dayEntry) => (
          <View style={{ marginBottom: 5 }}>
            <Text style={{ color: theme.light.grey, fontSize: 10 }}>
              {DateTime.fromISO(dayEntry.word.date).toFormat("EEE, MMM d")}
            </Text>
            <DayEntryBoard
              word={dayEntry.word.answer}
              attemptsDetail={dayEntry.attemptsDetails}
              date={dayEntry.word.date}
            />
          </View>
        )}
      />
    </WrappedLayout>
  )
}

export const ExistingWordMistakes: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useWrappedStats(userId)

  if (!data) {
    return <></>
  }

  const existingWordMistakes = data.stats.existingWordMistake

  if (!existingWordMistakes.length) {
    return (
      <WrappedLayout
        fullTitle="Congrats! you never guessed an **existing word!**"
        accentColor="pink"
        nextScreen="Socks"
      />
    )
  }

  return (
    <WrappedLayout
      fullTitle={`Don't forget to use the **search** feature!\n\nYou guessed an **existing word** ${
        existingWordMistakes.length
      } time${existingWordMistakes.length > 1 ? "s" : ""}`}
      accentColor="pink"
      title={`Times you guessed an existing word:`}
      nextScreen="Socks"
    >
      <ScrollView>
        <TwoColumnLayout
          data={existingWordMistakes}
          renderItem={(dayEntry) => {
            const entryDatetime = DateTime.fromISO(dayEntry.word.date)
            const existingGuessDatetime = DateTime.fromISO(
              dayEntry.existingGuess.date
            )
            return (
              <View style={{ marginBottom: 10 }}>
                <Text style={{ color: theme.light.grey, fontSize: 10 }}>
                  {entryDatetime.toFormat("EEE, MMM d")}
                </Text>
                <DayEntryBoard
                  word={dayEntry.word.answer}
                  attemptsDetail={dayEntry.attemptsDetails}
                  date={dayEntry.word.date}
                />
                <Text
                  style={{
                    marginTop: 2,
                    color: theme.light.red,
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                >
                  {dayEntry.existingGuess.word}:{" "}
                  {existingGuessDatetime.toFormat("MMM d")}
                </Text>
                <Text
                  style={{
                    color: theme.light.red,
                    fontSize: 10,
                    fontWeight: "bold",
                    flexWrap: "wrap",
                  }}
                >
                  {`(${Math.floor(
                    entryDatetime.diff(existingGuessDatetime).as("days")
                  )} days before)`}
                </Text>
              </View>
            )
          }}
        />
      </ScrollView>
    </WrappedLayout>
  )
}

export const Socks: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useWrappedStats(userId)

  if (!data) {
    return <></>
  }

  const socks = data.stats.socks

  if (!socks.length) {
    return (
      <WrappedLayout
        fullTitle="Congrats! you had no 🧦s this season!!"
        nextScreen="Traps"
      />
    )
  }

  return (
    <WrappedLayout
      fullTitle={`You've made ${socks.length} 🧦${
        socks.length !== 1 ? "s" : ""
      } this season!`}
      title={`Your sad 🧦${socks.length !== 1 ? "s" : ""}:`}
      nextScreen="Traps"
    >
      <TwoColumnLayout
        data={socks}
        renderItem={(dayEntry) => (
          <View style={{ marginBottom: 5 }}>
            <Text style={{ color: theme.light.grey, fontSize: 10 }}>
              {DateTime.fromISO(dayEntry.word.date).toFormat("EEE, MMM d")}
            </Text>
            <DayEntryBoard
              word={dayEntry.word.answer}
              attemptsDetail={dayEntry.attemptsDetails}
              date={dayEntry.word.date}
            />
            <Text
              style={{
                marginTop: 2,
                color: theme.light.red,
                fontSize: 10,
                fontWeight: "bold",
                flexWrap: "wrap",
              }}
            >
              {`Answer: ${dayEntry.word.answer}`}
            </Text>
          </View>
        )}
      />
    </WrappedLayout>
  )
}

export const Traps: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useWrappedStats(userId)

  if (!data) {
    return <></>
  }

  const traps = data.stats.traps

  if (!traps.length) {
    return (
      <WrappedLayout
        fullTitle="Congrats! You didnt' fall into any **traps** this season!"
        accentColor="blue"
        nextScreen="InitiatedPings"
      />
    )
  }

  return (
    <WrappedLayout
      fullTitle={`Throwback to the ${traps.length} time${
        traps.length === 1 ? "" : "s"
      } you got **trapped** this season!`}
      accentColor="blue"
      title={`Some very sad traps:`}
      nextScreen="InitiatedPings"
    >
      <ScrollView>
        <TwoColumnLayout
          data={traps}
          renderItem={(dayEntry) => (
            <View style={{ marginBottom: 10 }}>
              <Text style={{ color: theme.light.grey, fontSize: 10 }}>
                {DateTime.fromISO(dayEntry.word.date).toFormat("EEE, MMM d")}
              </Text>
              <DayEntryBoard
                word={dayEntry.word.answer}
                attemptsDetail={dayEntry.attemptsDetails}
                date={dayEntry.word.date}
              />
            </View>
          )}
        />
      </ScrollView>
    </WrappedLayout>
  )
}

export const InitiatedPings: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useWrappedStats(userId)
  const { data: friendsData } = useFriends(userId)

  if (!data || !friendsData) {
    return <></>
  }

  const pings = data.stats.initiatedPingFriendOccuranceMap
  const pingedFriends = Object.keys(pings).sort((a, b) => pings[b] - pings[a])
  const totalNumberOfPings = pingedFriends.reduce(
    (acc, curr) => acc + pings[curr],
    0
  )

  if (!pingedFriends.length) {
    return (
      <WrappedLayout
        nextScreen="RecievedPings"
        fullTitle={`Don't forget about your friends!\n\nYou didn't **ping** anyone to play this season!`}
        accentColor="red"
      />
    )
  }

  return (
    <WrappedLayout
      fullTitle={`Don't forget about your friends!!\n\nYou **pinged** people to play ${totalNumberOfPings} times`}
      title={`Here are the people you keep pinging:`}
      nextScreen="RecievedPings"
      accentColor="red"
    >
      <View style={{ marginTop: 40, alignItems: "center" }}>
        {pingedFriends.map((friendId) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
              width: "70%",
            }}
          >
            <Text
              style={{
                color: friendsData[friendId].color,
                fontWeight: "bold",
                fontSize: 30,
              }}
            >
              {friendsData[friendId].name}
            </Text>
            <Text style={{ fontSize: 20 }}>{pings[friendId]}x</Text>
          </View>
        ))}
      </View>
    </WrappedLayout>
  )
}

export const RecievedPings: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useWrappedStats(userId)
  const { data: friendsData } = useFriends(userId)

  if (!data || !friendsData) {
    return <></>
  }

  const pings = data.stats.recievedPingFriendOccuranceMap
  const pingFriends = Object.keys(pings).sort((a, b) => pings[b] - pings[a])
  const totalNumberOfPings = pingFriends.reduce(
    (acc, curr) => acc + pings[curr],
    0
  )

  if (!pingFriends.length) {
    return (
      <WrappedLayout
        nextScreen="Closing"
        fullTitle="Don't forget to play! No one reminded you to play this season!"
        accentColor="yellow"
      />
    )
  }

  return (
    <WrappedLayout
      fullTitle={`Don't forget to play!!\n\nYour friends **reminded** you to play ${totalNumberOfPings} times!`}
      accentColor="yellow"
      title={`Here are the people that keep pinging you`}
      nextScreen="Closing"
    >
      <View style={{ marginTop: 40, alignItems: "center" }}>
        {pingFriends.map((friendId) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
              width: "70%",
            }}
          >
            <Text
              style={{
                color: friendsData[friendId].color,
                fontWeight: "bold",
                fontSize: 30,
              }}
            >
              {friendsData[friendId].name}
            </Text>
            <Text style={{ fontSize: 20 }}>{pings[friendId]}x</Text>
          </View>
        ))}
      </View>
    </WrappedLayout>
  )
}

export const WrappedClosing: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useWrappedStats(userId)
  const seasonNumber = data?.sk.split("#").slice(-1)[0]

  return (
    <WrappedLayout
      fullTitle={`That's a **wrap** on season ${seasonNumber}!!\n\nYou can get back here by tapping the **gift icon** in the header!`}
      accentColor="green"
      nextScreen="Root"
    ></WrappedLayout>
  )
}
