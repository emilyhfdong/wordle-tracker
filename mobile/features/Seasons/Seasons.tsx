import { DateTime } from "luxon"
import React, { useState } from "react"
import { View, Text, FlatList } from "react-native"
import { theme } from "../../constants"
import { useFriends, useSeasons } from "../../query"
import { useAppSelector } from "../../redux"
import { TGetSeasonsResponse } from "../../services"
import {
  ExpandableListItem,
  FullScreenLoading,
  InitialIcon,
} from "../../shared"
import {
  getMedal,
  SeasonLeaderBoard,
} from "../SeasonEndModal/components/SeasonLeaderBoard"

type SeasonsProps = {}

export const Seasons: React.FC<SeasonsProps> = () => {
  const { data, isLoading } = useSeasons()

  if (isLoading) {
    return <FullScreenLoading />
  }

  const endOfNextSeason = DateTime.now().endOf("quarter")

  return (
    <View
      style={{
        backgroundColor: "#F9F9F9",
        paddingHorizontal: 10,
        paddingTop: 10,
        flex: 1,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 12,
          marginBottom: 5,
          color: theme.light.grey,
        }}
      >
        Current season ends in{" "}
        {Math.floor(endOfNextSeason.diff(DateTime.now()).as("days"))} days (
        {endOfNextSeason.toFormat("MMM dd")})
      </Text>
      <FlatList
        data={data}
        renderItem={({ item: season, index }) => (
          <SeasonListItem
            key={season.endDate}
            season={season}
            isInitiallyExpanded={index === 0}
          />
        )}
      />
    </View>
  )
}

type SeasonListItemProps = {
  season: TGetSeasonsResponse[0]
  isInitiallyExpanded?: boolean
}

export const SeasonListItem: React.FC<SeasonListItemProps> = ({
  season,
  isInitiallyExpanded = false,
}) => {
  const { name, startDate, endDate, leaderboard } = season
  const [isExpanded, setIsExpanded] = useState(isInitiallyExpanded)
  const authUserId = useAppSelector((state) => state.user.id)

  const medals = leaderboard.map(({ userId }, idx) => ({
    id: userId,
    medal: getMedal(idx + 1),
  }))

  const medal = medals.find(({ id }) => id === authUserId)?.medal
  const { data: friendsData } = useFriends(authUserId)

  return (
    <ExpandableListItem
      title={`${medal || ""} ${name}`}
      subtitle={`${DateTime.fromISO(startDate).toFormat(
        "MMM dd yyyy"
      )} - ${DateTime.fromISO(endDate).toFormat("MMM dd yyyy")}`}
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      renderRightComponent={() => (
        <View style={{ flexDirection: "row" }}>
          {leaderboard.slice(0, 3).map(({ userId, name }) => (
            <InitialIcon
              key={userId}
              color={friendsData?.[userId]?.color || theme.light.lightGrey}
              name={name}
            />
          ))}
        </View>
      )}
    >
      <View style={{ paddingTop: 15 }}>
        <SeasonLeaderBoard season={season} />
      </View>
    </ExpandableListItem>
  )
}
