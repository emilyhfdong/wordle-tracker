import React from "react"
import { ScrollView, Text, View } from "react-native"
import { theme } from "../../../constants"
import { useFriends, useSeasons } from "../../../query"
import { useAppSelector } from "../../../redux"
import { TGetSeasonsResponse } from "../../../services"
import { RH, RW } from "../../../utils"

type SeasonLeaderBoardProps = {
  season: TGetSeasonsResponse[0]
}

export const SeasonLeaderBoard: React.FC<SeasonLeaderBoardProps> = ({
  season,
}) => {
  const userId = useAppSelector((state) => state.user.id)
  const { data: friendsData } = useFriends(userId)

  if (!season) {
    return null
  }
  return (
    <ScrollView
      style={{
        borderColor: theme.light.lightGrey,
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: RH(1),
        paddingHorizontal: RW(8),
        flexDirection: "column",
        width: "100%",
      }}
    >
      {season.leaderboard.map((user, idx) => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: RH(1),
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: theme.light.default,
            }}
          >
            {getRankingText(idx + 1)}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              color: friendsData?.[user.userId]?.color || theme.light.default,
            }}
          >
            {user.name}
            {getMedal(idx + 1)}
          </Text>
          <Text
            style={{
              marginRight: 4,
              fontWeight: "bold",
              color: theme.light.default,
              textAlignVertical: "center",
              fontSize: 12,
            }}
          >
            {user.average}
          </Text>
        </View>
      ))}
    </ScrollView>
  )
}

const getRankingText = (rank: number) => {
  switch (rank) {
    case 1:
      return "1ˢᵗ"
    case 2:
      return "2ⁿᵈ"
    case 3:
      return "3ʳᵈ"
    default:
      return `${rank}ᵗʰ`
  }
}

const getMedal = (rank: number) => {
  switch (rank) {
    case 1:
      return "🥇"
    case 2:
      return "🥈"
    case 3:
      return "🥉"
    default:
      return ""
  }
}
