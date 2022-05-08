import React, { useEffect, useState } from "react"
import {
  View,
  ScrollView,
  RefreshControl,
  InteractionManager,
} from "react-native"

import { useAppSelector } from "../../redux"
import { useFeed, useFriends } from "../../query"
import { FullScreenLoading } from "../../shared"
import { FeedEmptyState, GroupedDayEntries } from "./components"

export const Feed: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data, isLoading, refetch, isRefetching } = useFeed(userId)
  const { isLoading: friendsIsLoading } = useFriends(userId)
  const [interationsIsLoading, setInteractionsIsLoading] = useState(true)

  useEffect(() => {
    InteractionManager.runAfterInteractions(() =>
      setInteractionsIsLoading(false)
    )
  }, [])

  if (isLoading || friendsIsLoading || interationsIsLoading) {
    return <FullScreenLoading />
  }

  const groupedEntries = data?.dayEntriesByDate || []

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F9F9F9",
        paddingHorizontal: 10,
      }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <View style={{ paddingTop: 5 }}>
        {groupedEntries.map((group, idx) => (
          <GroupedDayEntries group={group} key={idx} />
        ))}
        {!groupedEntries.length && <FeedEmptyState />}
      </View>
    </ScrollView>
  )
}
