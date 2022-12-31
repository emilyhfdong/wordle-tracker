import { Ionicons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import React from "react"
import { theme } from "../../constants"
import { useWrappedStats } from "../../query"
import { useAppSelector } from "../../redux"

type WrappedIconProps = {}

export const WrappedIcon: React.FC<WrappedIconProps> = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data: wrappedData } = useWrappedStats(userId)
  const { navigate } = useNavigation()

  if (!wrappedData) {
    return <></>
  }

  return (
    <Ionicons
      name="ios-gift-outline"
      size={15}
      color={theme.light.grey}
      style={{ marginLeft: 20 }}
      onPress={() => navigate("Wrapped")}
    />
  )
}
