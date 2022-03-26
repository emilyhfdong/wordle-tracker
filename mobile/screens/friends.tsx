import React from "react"
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { useFeedRequest } from "../components/initializer.hooks"
import { theme } from "../constants/theme"
import { useAppSelector } from "../redux/hooks"

interface IFriendsProps {}

export const Friends: React.FC<IFriendsProps> = () => {
  const friends = useAppSelector((state) =>
    state.feed.friends ? Object.values(state.feed.friends) : []
  )
  const { refetch, isLoading } = useFeedRequest()

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
      {friends.map((friend) => (
        <View
          style={{
            marginVertical: 5,
            borderColor: "#E6E6E6",
            borderWidth: 1,
            borderRadius: 5,
            paddingVertical: 15,
            paddingHorizontal: 15,
            backgroundColor: theme.light.background,
          }}
        >
          <Text style={{ fontWeight: "bold", color: friend.color }}>
            {friend.name}
          </Text>
        </View>
      ))}
      <TouchableOpacity
        style={{
          marginVertical: 5,
          borderColor: "#E6E6E6",
          borderWidth: 1,
          borderRadius: 5,
          paddingVertical: 15,
          paddingHorizontal: 15,
          backgroundColor: "#F8F8F8",
        }}
      >
        <Text style={{ fontWeight: "bold", color: "black" }}>+ Add Friend</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
