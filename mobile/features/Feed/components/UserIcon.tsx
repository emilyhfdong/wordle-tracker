import React from "react"
import { View, Text } from "react-native"

import { useFriends } from "../../../query"

type TUserIconProps = {
  userId: string
}

export const UserIcon: React.FC<TUserIconProps> = ({ userId }) => {
  const { data } = useFriends(userId)

  if (!data || !data[userId]) {
    if (data && !data[userId]) {
      console.log("hii what?", userId, data)
    }
    return null
  }

  const { color, name } = data[userId]

  return (
    <View
      style={{
        backgroundColor: color,
        height: 3,
        width: 3,
        borderRadius: 1.5,
      }}
    >
      <Text>{name[0]}</Text>
    </View>
  )
}
