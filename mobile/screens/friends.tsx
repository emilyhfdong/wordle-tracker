import React from "react"
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native"
import { FriendListItem } from "../components/friend-list-item"
import { FullScreenLoading } from "../components/full-screen-loading"
import { useFriends } from "../query/hooks"
import { useAppSelector } from "../redux/hooks"
import { RootTabScreenProps } from "../types"

interface IFriendsProps {}

export const Friends: React.FC<
  IFriendsProps & RootTabScreenProps<"Friends">
> = ({ navigation }) => {
  const userId = useAppSelector((state) => state.user.id)
  const { data, isLoading, isRefetching, refetch } = useFriends(userId)

  if (isLoading || !data) {
    return <FullScreenLoading />
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
        onPress={() => navigation.navigate("AddFriend")}
      >
        <Text style={{ fontWeight: "bold", color: "black" }}>+ Add Friend</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}
