import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native"
import { theme } from "../constants/theme"
import { useAppSelector } from "../redux/hooks"
import { IDayEntry } from "../redux/slices/day-entries.slice"
import Share from "../assets/images/share.svg"
import { DateTime, Settings } from "luxon"
import * as Clipboard from "expo-clipboard"

interface ISummaryModalProps {
  isOpen: boolean
  closeModal: () => void
}

const getCurrentStreak = (dayEntries: IDayEntry[], todaysDate: string) => {
  let streak = 0
  let date = todaysDate
  for (let i = 0; i < dayEntries.length; i++) {
    if (dayEntries[i].date !== date) {
      return streak
    }
    streak += 1
    date = DateTime.fromISO(date).minus({ days: 1 }).toISODate()
  }
  return streak
}

const getMaxStreak = (dayEntries: IDayEntry[], todaysDate: string) => {
  let streak = 0
  let date = todaysDate
  for (let i = 0; i < dayEntries.length; i++) {
    streak += dayEntries[i].date === date ? 1 : 0
    date = DateTime.fromISO(date).minus({ days: 1 }).toISODate()
  }
  return streak
}

const mapCodeToEmoji: { [key: string]: string } = {
  "1": "🟨",
  "2": "🟩",
  "0": "⬜",
}

export const SummaryModal: React.FC<ISummaryModalProps> = ({
  isOpen,
  closeModal,
}) => {
  const todaysDate = useAppSelector((state) => state.todaysWord.date)
  const dayEntries = useAppSelector((state) => state.dayEntries)
  const wonEntries = dayEntries.filter((entry) => entry.attemptsCount <= 6)
  const winPercent = Math.round((wonEntries.length / dayEntries.length) * 100)
  const currentStreak = getCurrentStreak(dayEntries, todaysDate)
  const maxStreak = getMaxStreak(dayEntries, todaysDate)
  const lastEntry = dayEntries[0]
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

  const copyString = `Wordle ${lastEntry.number} ${
    lastEntry.attemptsCount
  }/6\n\n${lastEntry.attemptsDetails
    .split(" ")
    .map(
      (line) =>
        line
          .split("")
          .map((code) => mapCodeToEmoji[code])
          .join("") + "\n"
    )
    .join("")}`

  return (
    <Modal visible={isOpen} transparent>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
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
          <View
            style={{ flexDirection: "row", marginBottom: 25, marginTop: 10 }}
          >
            <Statistic label="Played" value={dayEntries.length} />
            <Statistic label="Win %" value={winPercent} />
            <Statistic label={"Current\nStreak"} value={currentStreak} />
            <Statistic label={"Max\nStreak"} value={maxStreak} />
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
              <Text style={{ fontSize: 35 }}>
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
                onPress={() => Clipboard.setString(copyString)}
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
                <Share />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={{ flex: 1, width: "100%" }} />
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  )
}

export const GuessDistribution: React.FC = () => {
  const dayEntries = useAppSelector((state) => state.dayEntries)
  const countOccurances = new Array(6).fill(0).map((_, idx) => ({
    count: idx + 1,
    occurance: dayEntries.filter((entry) => entry.attemptsCount - 2 === idx)
      .length,
  }))
  const maxOccurance = countOccurances.reduce(
    (acc, curr) => Math.max(acc, curr.occurance),
    0
  )
  return (
    <View style={{ width: "100%", marginVertical: 10 }}>
      {countOccurances.map(({ count, occurance }) => (
        <OccuranceBar
          key={count}
          occurance={occurance}
          count={count}
          maxOccurance={maxOccurance}
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
