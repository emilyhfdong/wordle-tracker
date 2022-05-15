import React from "react"
import { View, Text } from "react-native"
import { theme } from "../../../constants"

import { useFriends } from "../../../query"
import { useAppSelector } from "../../../redux"

type TUserIconProps = {
  userId: string
}

export const UserIcon: React.FC<TUserIconProps> = ({ userId }) => {
  const authUser = useAppSelector((state) => state.user)
  const { data } = useFriends(authUser.id)
  const isAuthUser = authUser.id === userId

  if (!data || (!data[userId] && !isAuthUser)) {
    return null
  }

  const { color, name } =
    userId === authUser.id
      ? { color: theme.light.lightGrey, name: authUser.name }
      : data[userId]

  return (
    <View
      style={{
        backgroundColor: color,
        height: 12,
        width: 12,
        borderRadius: 6,
        marginLeft: 3,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 7, color: "white", fontWeight: "bold" }}>
        {name[0].toUpperCase()}
      </Text>
    </View>
  )
}
