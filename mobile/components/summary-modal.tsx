import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Share,
} from "react-native"
import { theme } from "../constants/theme"
import { useAppSelector } from "../redux/hooks"
import ShareIcon from "../assets/images/share.svg"
import { DateTime, Settings } from "luxon"
import { getTileColor } from "./tile"
import { useUser } from "../query/hooks"

interface ISummaryModalProps {
  isOpen: boolean
  closeModal: () => void
}

const tileColorToEmoji = {
  [theme.light.yellow]: "🟨",
  [theme.light.green]: "🟩",
  [theme.light.grey]: "⬜",
}

const getSquares = (guesses: string[], word: string) => {
  return guesses
    .map(
      (guess) =>
        `${guess
          .split("")
          .map(
            (letter, index) =>
              tileColorToEmoji[getTileColor({ index, letter, word })]
          )
          .join("")}`
    )
    .join("\r\n")
}

export const SummaryModal: React.FC<ISummaryModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useUser(userId)
  const lastEntry = data?.lastEntry
  const [currentTime, setCurrentTime] = useState(DateTime.now())

  Settings.defaultZone = "America/Toronto"
  const nextWordle = DateTime.now().endOf("day").plus({ minutes: 3 })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(DateTime.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!lastEntry) {
    return null
  }

  const copyString = `Wordzle ${lastEntry.word.number} ${
    lastEntry.attemptsCount
  }/6\n\n${getSquares(
    lastEntry.attemptsDetails.split(" "),
    lastEntry.word.answer
  )}`

  return isOpen ? (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        position: "absolute",
        top: 0,
        zIndex: 3,
        height: "100%",
        width: "100%",
      }}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={{ flex: 1, width: "100%" }} />
      </TouchableWithoutFeedback>

      <View
        style={{
          width: "90%",
          backgroundColor: theme.light.background,
          shadowColor: theme.light.default,
          shadowOpacity: 0.2,
          shadowOffset: { width: 0, height: 4 },
          shadowRadius: 23,
          borderRadius: 8,
          alignItems: "center",
          paddingVertical: 40,
          paddingHorizontal: 30,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>STATISTICS</Text>
        <View style={{ flexDirection: "row", marginBottom: 25, marginTop: 10 }}>
          <Statistic label="Played" value={data?.numberOfDaysPlayed || 0} />
          <Statistic label="Win %" value={data?.winPercent || 0} />
          <Statistic
            label={"Current\nStreak"}
            value={data?.currentStreak || 0}
          />
          <Statistic label={"Max\nStreak"} value={data?.maxStreak || 0} />
        </View>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>
          GUESS DISTRIBUTION
        </Text>
        <GuessDistribution />
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            marginTop: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}
            >
              NEXT WORDLE
            </Text>
            <Text style={{ fontSize: 33 }}>
              {nextWordle.diff(currentTime).toFormat("hh:mm:ss")}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: theme.light.green,
                flexDirection: "row",
                padding: 14,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 4,
              }}
              onPress={() => Share.share({ message: copyString })}
            >
              <Text
                style={{
                  color: theme.light.background,
                  fontWeight: "bold",
                  fontSize: 20,
                  paddingRight: 5,
                }}
              >
                SHARE
              </Text>
              <ShareIcon />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={{ flex: 1, width: "100%" }} />
      </TouchableWithoutFeedback>
    </View>
  ) : null
}

export const GuessDistribution: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useUser(userId)
  const countOccurances = data?.guessDistribution
  const maxOccurance = countOccurances?.reduce(
    (acc, curr) => Math.max(acc, curr.occurance),
    0
  )
  return (
    <View style={{ width: "100%", marginVertical: 10 }}>
      {countOccurances?.map(({ count, occurance }) => (
        <OccuranceBar
          key={count}
          occurance={occurance}
          count={count}
          maxOccurance={maxOccurance || 1}
        />
      ))}
    </View>
  )
}

interface IOccuranceBarProps {
  count: number
  occurance: number
  maxOccurance: number
}

export const OccuranceBar: React.FC<IOccuranceBarProps> = ({
  count,
  occurance,
  maxOccurance,
}) => {
  return (
    <View style={{ flexDirection: "row", marginBottom: 4 }}>
      <Text style={{ width: 12 }}>{count}</Text>
      <View
        style={{
          backgroundColor: occurance ? theme.light.green : theme.light.grey,
          height: "100%",
          flex: occurance / maxOccurance,
          paddingHorizontal: 5,
        }}
      >
        <Text
          style={{
            color: theme.light.background,
            textAlign: "right",
            fontWeight: "bold",
          }}
        >
          {occurance}
        </Text>
      </View>
    </View>
  )
}

interface IStatisticProps {
  label: string
  value: number
}

export const Statistic: React.FC<IStatisticProps> = ({ value, label }) => {
  return (
    <View
      style={{
        alignItems: "center",
        marginHorizontal: 10,
      }}
    >
      <Text style={{ fontSize: 35, marginBottom: 2, textAlign: "center" }}>
        {value}
      </Text>
      <Text style={{ fontSize: 12, textAlign: "center" }}>{label}</Text>
    </View>
  )
}
