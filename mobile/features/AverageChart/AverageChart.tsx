import React, { useState } from "react"
import { ScrollView, View } from "react-native"
import { LineChart } from "react-native-svg-charts"
import { useFriends, useUser } from "../../query"
import { useAppSelector } from "../../redux"
import { theme } from "../../constants"
import { FullScreenLoading, ListItem } from "../../shared"
import Ionicons from "@expo/vector-icons/Ionicons"
import { RH } from "../../utils"

export const AverageChart: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data: userData } = useUser(userId)
  const { data: friendsData } = useFriends(userId)
  const [includedFriendIds, setIncludedFriendIds] = useState<string[]>([])
  if (!friendsData || !userData) {
    return <FullScreenLoading />
  }
  const friends = Object.values(friendsData)
  const data = [
    { data: userData.last30Averages, svg: { stroke: theme.light.grey } },
    ...friends
      .filter((friend) => includedFriendIds.includes(friend.userId))
      .map((friend) => ({
        data: friend.last30Averages,
        svg: { stroke: friend.color },
      })),
  ]

  return (
    <View
      style={{
        backgroundColor: "#F9F9F9",
        paddingHorizontal: 10,
        paddingTop: 10,
      }}
    >
      <LineChart
        style={{
          height: 300,
          backgroundColor: theme.light.background,
          borderColor: "#E6E6E6",
          borderWidth: 1,
          borderRadius: 5,
        }}
        data={data}
        contentInset={{ top: 30, bottom: 30 }}
      ></LineChart>
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
            <ListItem
              onPress={() => {
                if (isSelected) {
                  setIncludedFriendIds(
                    includedFriendIds.filter((id) => id !== friend.userId)
                  )
                } else {
                  setIncludedFriendIds([...includedFriendIds, friend.userId])
                }
              }}
              key={friend.userId}
              title={friend.name}
              titleColor={friend.color}
              subtitle={`current avg: ${friend.averageAttemptsCount}`}
              rightComponent={
                <Ionicons
                  name={isSelected ? "checkbox" : "square-outline"}
                  size={20}
                  color={theme.light.grey}
                />
              }
            />
          )
        })}
      </ScrollView>
    </View>
  )
}
