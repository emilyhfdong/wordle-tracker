import React from "react"
import { View, Text, ScrollView, RefreshControl } from "react-native"
import { theme } from "../constants/theme"
import { useAppSelector } from "../redux/hooks"
import { DateTime } from "luxon"
import { getTileColor } from "../components/tile"
import { useFeedRequest } from "../components/initializer.hooks"
import { IFeedDayEntry } from "../redux/slices/feed.slice"
import { Title } from "../components/title"

interface IFeedProps {}

export const Feed: React.FC<IFeedProps> = () => {
  const { friends, groupedEntries, isLoading, refetch } = useFeedRequest()

  if (!friends) {
    return null
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F9F9F9",
        paddingVertical: 20,
        paddingHorizontal: 15,
      }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    >
      {groupedEntries?.map((group, groupIdx) => (
        <View
          key={groupIdx}
          style={{
            alignItems: "center",
            paddingBottom: 30,
          }}
        >
          <View
            style={{
              backgroundColor: "#F0F0F0",
              height: 20,
              borderRadius: 8,
              paddingHorizontal: 10,
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <Text>{DateTime.fromISO(group.date).toFormat("EEE, MMM d")}</Text>
          </View>
          {group.entries.map((entry, idx) => (
            <DayEntry key={idx} {...entry} date={group.date} />
          ))}
        </View>
      ))}
      {!groupedEntries?.length && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: 600,
          }}
        >
          <Text style={{ fontSize: 50, marginBottom: 10 }}>✨</Text>
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              marginBottom: 30,
            }}
          >
            Your results and your friend's results will show up here!
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

export const DayEntry: React.FC<IFeedDayEntry & { date: string }> = ({
  userId,
  word,
  attemptsDetails,
  createdAt,
  date,
}) => {
  const self = useAppSelector((state) => state.user)
  const isSelf = userId === self.id
  const friends = useAppSelector((state) => state.feed.friends)
  if (!friends) {
    return null
  }
  const friend = friends[userId]

  return (
    <View
      style={{
        width: "100%",
        alignItems: isSelf ? "flex-end" : "flex-start",
      }}
    >
      <View
        style={{
          marginVertical: 5,
          borderColor: "#E6E6E6",
          borderWidth: 1,
          borderRadius: 5,
          paddingVertical: 10,
          paddingHorizontal: 15,
          backgroundColor: theme.light.background,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            color: isSelf ? theme.light.grey : friend.color,
            marginBottom: 5,
            textAlign: isSelf ? "right" : "left",
          }}
        >
          {isSelf ? self.name : friend.name}
        </Text>
        <Board word={word} attemptsDetail={attemptsDetails} date={date} />
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
  const selfDayEntries = useAppSelector((state) => state.dayEntries)
  const hasPlayedThisDay = selfDayEntries.some((entry) => entry.date === date)
  return (
    <View>
      {attemptsDetail.split(" ").map((attemptWord, wordIdx) => (
        <View key={wordIdx} style={{ flexDirection: "row" }}>
          {attemptWord.split("").map((letter, index) => (
            <View
              style={{
                backgroundColor: getTileColor({ letter, word, index }),
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
