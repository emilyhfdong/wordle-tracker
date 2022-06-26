import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import React from "react"
import { TouchableOpacity } from "react-native"
import { theme } from "../../constants"

type AddFriendHeaderProps = {}

export const AddFriendHeader: React.FC<AddFriendHeaderProps> = () => {
  const { navigate } = useNavigation()
  return (
    <TouchableOpacity
      onPress={() => navigate("AddFriend")}
      style={{ marginLeft: 20 }}
    >
      <Ionicons name={"person-add"} size={16} color={theme.light.grey} />
    </TouchableOpacity>
  )
}
