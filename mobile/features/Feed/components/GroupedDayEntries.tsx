import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  InteractionManager,
} from "react-native"
import { DateTime } from "luxon"

import { theme } from "../../../constants"
import { useAppSelector } from "../../../redux"
import { useFeed, useFriends, useUser } from "../../../query"
import { TDayEntry, TGroupedDayEntries } from "../../../services"
import { getTileColor, FullScreenLoading, ListItem } from "../../../shared"
import { UserIcon } from "./UserIcon"

type TGroupedDayEntriesProps = {
  group: TGroupedDayEntries
}

export const GroupedDayEntries: React.FC<TGroupedDayEntriesProps> = ({
  group: { date, entries },
}) => {
  const todaysDate = useAppSelector((state) => state.todaysWord.date)
  const expanded = todaysDate === date && false
  const formattedDate = DateTime.fromISO(date).toFormat("EEE, MMM d")
  const ans = entries[0]?.word.answer || ""
  if (true) {
    return (
      <ListItem
        title={`${formattedDate} - ${ans}`}
        subtitle="blah"
        rightComponent={
          <>
            {entries.map(({ userId }) => (
              <UserIcon key={userId} userId={userId} />
            ))}
          </>
        }
      >
        {expanded &&
          entries
            .slice()
            .reverse()
            .map((entry, idx) => <DayEntry key={idx} {...entry} date={date} />)}
      </ListItem>
    )
  }
}

export const DayEntry: React.FC<TDayEntry & { date: string }> = ({
  userId,
  word,
  attemptsDetails,
  createdAt,
  date,
  attemptsCount,
}) => {
  const selfUserId = useAppSelector((state) => state.user.id)
  const isSelf = useAppSelector((state) => state.user.id === userId)
  const { data } = useFriends(selfUserId)

  if (!data) {
    return null
  }
  const friend = data[userId]

  return (
    <View
      style={{
        width: "100%",
        alignItems: isSelf ? "flex-end" : "flex-start",
      }}
    >
      <View
        style={{
          marginTop: 10,
          borderColor: "#E6E6E6",
          borderWidth: 1,
          borderRadius: 5,
          paddingVertical: 6,
          paddingHorizontal: 10,
          backgroundColor: theme.light.background,
        }}
      >
        <View
          style={{
            flexDirection: isSelf ? "row-reverse" : "row",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: isSelf ? theme.light.grey : friend.color,
              textAlign: isSelf ? "right" : "left",
            }}
          >
            {isSelf ? self.name : friend.name}
          </Text>
          <Text style={{ color: theme.light.grey, fontSize: 12 }}>
            {attemptsCount <= 6 ? attemptsCount : "X"} / 6
          </Text>
        </View>
        <Board
          word={word.answer}
          attemptsDetail={attemptsDetails}
          date={date}
        />
        <Text
          style={{
            color: theme.light.grey,
            marginTop: 7,
            textAlign: "right",
            fontSize: 10,
          }}
        >
          {DateTime.fromISO(createdAt).toFormat("t")}
        </Text>
      </View>
    </View>
  )
}

interface IBoardProps {
  attemptsDetail: string
  word: string
  date: string
}

export const Board: React.FC<IBoardProps> = ({
  word,
  attemptsDetail,
  date,
}) => {
  const userId = useAppSelector((state) => state.user.id)
  const { data } = useUser(userId)
  const todaysDate = useAppSelector((state) => state.todaysWord.date)
  const hasPlayedThisDay = data?.datesPlayed.includes(date)
  const isTodaysWordAndHaventPlayed = !hasPlayedThisDay && todaysDate === date

  return (
    <View>
      {attemptsDetail.split(" ").map((attemptWord, wordIdx) => (
        <View key={wordIdx} style={{ flexDirection: "row" }}>
          {attemptWord.split("").map((letter, index) => (
            <View
              style={{
                backgroundColor: !isTodaysWordAndHaventPlayed
                  ? getTileColor({ letter, word, index })
                  : theme.light.grey,
                height: 35,
                width: 35,
                margin: 2,
                justifyContent: "center",
                alignItems: "center",
              }}
              key={index}
            >
              <Text
                style={{
                  color: theme.light.background,
                  fontWeight: "bold",
                  fontSize: 18,
                }}
              >
                {hasPlayedThisDay ? letter : ""}
              </Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  )
}
