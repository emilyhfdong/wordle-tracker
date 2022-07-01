import React, { useEffect, useState } from "react"
import { ScrollView, View } from "react-native"
import { LineChart, Grid, YAxis } from "react-native-svg-charts"
import { useFriends, useUser } from "../../query"
import { useAppSelector } from "../../redux"
import { theme } from "../../constants"
import { FullScreenLoading } from "../../shared"
import { RH } from "../../utils"
import { Defs, LinearGradient, Stop } from "react-native-svg"
import { FriendListItem } from "./components"
import * as shape from "d3-shape"

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
      (acc, curr) => Math.max(acc, curr),
      Number.MIN_SAFE_INTEGER
    ),
    min: allData.reduce(
      (acc, curr) => Math.min(acc, curr),
      Number.MAX_SAFE_INTEGER
    ),
  }
}

export const AverageChart: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data: userData } = useUser(userId)
  const { data: friendsData } = useFriends(userId)
  const [includedFriendIds, setIncludedFriendIds] = useState<string[]>([])
  if (!friendsData || !userData) {
    return <FullScreenLoading />
  }
  const friends = Object.values(friendsData)
  const [userAverages, setUserAverages] = useState(new Array(30).fill(0))
  useEffect(() => {
    const initialize = () => {
      if (userData) {
        setUserAverages(userData.lastAverages)
      }
    }
    const timeout = setTimeout(initialize, 200)
    return () => clearTimeout(timeout)
  }, [userData])

  const data = [
    {
      id: userData.userId,
      data: userAverages,
      svg: { stroke: `url(#${GRADIENT_ID})`, strokeWidth: 2 },
    },
    ...friends
      .filter((friend) => includedFriendIds.includes(friend.userId))
      .map((friend) => ({
        id: friend.userId,
        data: friend.lastAverages,
        svg: { stroke: friend.color, strokeWidth: 2 },
      })),
  ]
  const { min, max } = getMinMax(data)

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
            height: 300,
            backgroundColor: theme.light.background,
            borderColor: "#E6E6E6",
            borderWidth: 1,
            borderRadius: 5,
            flex: 1,
          }}
          curve={shape.curveNatural}
          animate
          svg={{ stroke: `url(#${GRADIENT_ID})`, strokeWidth: 2 }}
          data={userAverages}
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
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 200,
          paddingVertical: 5,
        }}
        style={{ height: RH(100) - 300 }}
      >
        {friends.map((friend) => {
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
