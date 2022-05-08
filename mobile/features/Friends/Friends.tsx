import React from "react"
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native"
import { useFriends } from "../../query"
import { useAppSelector } from "../../redux"
import { FullScreenLoading } from "../../shared"
import { FriendListItem } from "./components"
import { useNavigation } from "@react-navigation/native"

export const Friends: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data, isLoading, isRefetching, refetch } = useFriends(userId)
  const { navigate } = useNavigation()

  if (isLoading || !data) {
    return <FullScreenLoading />
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F9F9F9",
      }}
      contentContainerStyle={{ paddingVertical: 10, paddingHorizontal: 10 }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      {Object.values(data).map((friend, idx) => (
        <FriendListItem key={idx} {...friend} />
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
        onPress={() => navigate("AddFriend")}
      >
        <Text style={{ fontWeight: "bold", color: "black" }}>+ Add Friend</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
