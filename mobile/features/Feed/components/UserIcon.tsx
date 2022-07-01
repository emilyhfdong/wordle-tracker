import React from "react"
import { View, Text } from "react-native"
import { theme } from "../../../constants"

import { useFriends } from "../../../query"
import { useAppSelector } from "../../../redux"
import { InitialIcon } from "../../../shared"

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

  return <InitialIcon name={name} color={color} />
}
