import React, { useEffect, useState } from "react"
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActionSheetIOS,
} from "react-native"
import { LineChart, Grid, YAxis } from "react-native-svg-charts"
import { useFriends, useUser } from "../../query"
import { useAppSelector } from "../../redux"
import { theme } from "../../constants"
import { FullScreenLoading } from "../../shared"
import { RH } from "../../utils"
import { Defs, LinearGradient, Stop } from "react-native-svg"
import { FriendListItem } from "./components"
import * as shape from "d3-shape"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { TFriend, TGetFriendsResponse } from "../../services"

const GRADIENT_ID = "gradient"
const CONTENT_INSET = { top: 10, bottom: 10 }
const NUMBER_OF_TICKS = 10
const Gradient = () => (
  <Defs key={GRADIENT_ID}>
    <LinearGradient id={GRADIENT_ID} x1={"0"} y1={"0%"} x2={"100%"} y2={"0%"}>
      <Stop offset="0%" stopColor={"#78CFA0"} />
      <Stop offset="33%" stopColor={"#7DBCE8"} />
      <Stop offset="66%" stopColor={"#457AF9"} />
      <Stop offset="100%" stopColor={"#C6449F"} />
    </LinearGradient>
  </Defs>
)

const getMinMax = (
  datasets: {
    data: number[]
    svg: {
      stroke: string
      strokeWidth: number
    }
  }[]
) => {
  const allData = datasets.reduce(
    (acc, curr) => [...acc, ...curr.data],
    [] as number[]
  )
  return {
    max: allData.reduce(
      (acc, curr) => (typeof curr === "number" ? Math.max(acc, curr) : acc),
      Number.MIN_SAFE_INTEGER
    ),
    min: allData.reduce(
      (acc, curr) => (typeof curr === "number" ? Math.min(acc, curr) : acc),
      Number.MAX_SAFE_INTEGER
    ),
  }
}

type TSortBy = "dateAdded" | "bestAverage" | "longestStreak"

const SORT_BY: {
  [key in TSortBy]: {
    title: string
    sortFn: (friendA: TFriend, friendB: TFriend) => number
  }
} = {
  dateAdded: {
    title: "Date added",
    sortFn: () => 1,
  },
  bestAverage: {
    title: "Best average",
    sortFn: (a, b) => a.averageAttemptsCount - b.averageAttemptsCount,
  },
  longestStreak: {
    title: "Longest streak",
    sortFn: (a, b) => b.currentStreak - a.currentStreak,
  },
}

export const AverageChart: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data: userData } = useUser(userId)
  const { data: friendsData } = useFriends(userId)
  const [includedFriendIds, setIncludedFriendIds] = useState<string[]>([userId])
  const [sortBy, setSortBy] = useState<TSortBy>("bestAverage")

  if (!friendsData || !userData) {
    return <FullScreenLoading />
  }

  const friends: TFriend[] = [
    {
      userId: userData.userId,
      averageAttemptsCount: userData.averageAttemptsCount,
      color: theme.light.default,
      currentStreak: userData.currentStreak,
      lastAverages: userData.lastAverages,
      lastPlayed: userData.lastPlayed,
      name: `⭐️  ${userData.name}  ⭐️`,
      pingStatus: "notifications_disabled",
    },
    ...Object.values(friendsData),
  ]

  const data = friends
    .filter((friend) => includedFriendIds.includes(friend.userId))
    .map((friend) => ({
      id: friend.userId,
      data: friend.lastAverages,
      svg: {
        stroke:
          friend.userId === userId ? `url(#${GRADIENT_ID})` : friend.color,
        strokeWidth: 2,
      },
    }))

  const { min, max } = getMinMax(data)

  const onSortByPress = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "Date added", "Best average", "Longest streak"],
        cancelButtonIndex: 0,
        title: "Sort by:",
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 1:
            setSortBy("dateAdded")
            break
          case 2:
            setSortBy("bestAverage")
            break
          case 3:
            setSortBy("longestStreak")
            break
        }
      }
    )

  console.log("hii min", min)

  return (
    <View
      style={{
        backgroundColor: "#F9F9F9",
        paddingHorizontal: 10,
        paddingTop: 10,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <YAxis
          data={data}
          style={{ marginBottom: 0, marginRight: 3 }}
          svg={{ fontSize: 8, fill: theme.light.grey }}
          max={max}
          min={min}
          contentInset={CONTENT_INSET}
          numberOfTicks={NUMBER_OF_TICKS}
        />
        <LineChart
          style={{
            height: 250,
            backgroundColor: theme.light.background,
            borderColor: "#E6E6E6",
            borderWidth: 1,
            borderRadius: 5,
            flex: 1,
          }}
          curve={shape.curveNatural}
          animate
          svg={{ stroke: `url(#${GRADIENT_ID})`, strokeWidth: 2 }}
          data={data}
          contentInset={CONTENT_INSET}
          gridMax={max}
          gridMin={min}
          numberOfTicks={NUMBER_OF_TICKS}
          animationDuration={300}
        >
          <Grid svg={{ stroke: "#E6E6E6", strokeWidth: 1 }} belowChart={true} />
          <Gradient />
        </LineChart>
      </View>
      <View
        style={{
          marginTop: 10,
          paddingHorizontal: 5,
          alignItems: "flex-start",
        }}
      >
        <TouchableOpacity
          onPress={onSortByPress}
          style={{
            borderColor: "#457AF9",
            borderWidth: 1.5,
            height: 30,
            justifyContent: "center",
            paddingHorizontal: 10,
            borderRadius: 15,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <FontAwesome
            style={{ marginRight: 5 }}
            name={"sort"}
            size={15}
            color={"#457AF9"}
          />
          <Text style={{ color: "#457AF9", fontWeight: "600" }}>
            {SORT_BY[sortBy].title}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 200,
          paddingVertical: 5,
        }}
        style={{ height: RH(100) - 300 }}
      >
        {friends.sort(SORT_BY[sortBy].sortFn).map((friend) => {
          const isSelected = includedFriendIds.includes(friend.userId)
          return (
            <FriendListItem
              key={friend.userId}
              {...friend}
              isSelected={isSelected}
              onCheckboxPress={() => {
                if (isSelected) {
                  setIncludedFriendIds(
                    includedFriendIds.filter((id) => id !== friend.userId)
                  )
                } else {
                  setIncludedFriendIds([...includedFriendIds, friend.userId])
                }
              }}
            />
          )
        })}
      </ScrollView>
    </View>
  )
}
