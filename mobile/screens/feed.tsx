import React from "react"
import { View, Text, ScrollView, RefreshControl } from "react-native"
import { theme } from "../constants/theme"
import { useAppSelector } from "../redux/hooks"
import { DateTime } from "luxon"
import { getTileColor } from "../components/tile"
import { useFeed, useFriends, useUser } from "../query/hooks"
import { FullScreenLoading } from "../components/full-screen-loading"
import { TDayEntry } from "../services/types"

export const Feed: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data, isLoading, refetch, isRefetching } = useFeed(userId)
  const { isLoading: friendsIsLoading } = useFriends(userId)

  if (isLoading || friendsIsLoading) {
    return <FullScreenLoading />
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F9F9F9",
        paddingHorizontal: 15,
        transform: [{ scaleY: -1 }],
      }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <View style={{ transform: [{ scaleY: -1 }], paddingTop: 20 }}>
        {data?.dayEntriesByDate
          ?.slice()
          .reverse()
          ?.map((group, groupIdx) => (
            <View
              key={groupIdx}
              style={{
                alignItems: "center",
                paddingBottom: 20,
              }}
            >
              <View
                style={{
                  backgroundColor: "#F0F0F0",
                  height: 20,
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  justifyContent: "center",
                }}
              >
                <Text>
                  {DateTime.fromISO(group.date).toFormat("EEE, MMM d")}
                </Text>
              </View>
              {group.entries
                .slice()
                .reverse()
                .map((entry, idx) => (
                  <DayEntry key={idx} {...entry} date={group.date} />
                ))}
            </View>
          ))}
        {!data?.dayEntriesByDate?.length && (
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
      </View>
    </ScrollView>
  )
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
            {attemptsCount} / 6
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
