import React, { useEffect, useState } from "react"
import { RefreshControl, InteractionManager, FlatList } from "react-native"

import { useAppSelector } from "../../redux"
import { useFeed, useFriends, useUser } from "../../query"
import { FullScreenLoading } from "../../shared"
import { FeedEmptyState, GroupedDayEntries } from "./components"

export const Feed: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data, isLoading, refetch: refetchFeed } = useFeed(userId)
  const { refetch: refetchUser } = useUser(userId)
  const { isLoading: friendsIsLoading } = useFriends(userId)
  const [interationsIsLoading, setInteractionsIsLoading] = useState(true)
  const [isRefetching, setIsRefetching] = useState(false)

  const onRefresh = async () => {
    setIsRefetching(true)
    await Promise.all([refetchFeed(), refetchUser()])
    setIsRefetching(false)
  }

  useEffect(() => {
    InteractionManager.runAfterInteractions(() =>
      setInteractionsIsLoading(false)
    )
  }, [])

  if (isLoading || friendsIsLoading || interationsIsLoading) {
    return <FullScreenLoading />
  }

  if (!data?.dayEntriesByDate.length) {
    return <FeedEmptyState />
  }

  return (
    <FlatList
      data={data?.dayEntriesByDate || []}
      style={{
        flex: 1,
        backgroundColor: "#F9F9F9",
        paddingHorizontal: 10,
        paddingTop: 5,
      }}
      renderItem={({ item }) => (
        <GroupedDayEntries group={item} key={item.date} />
      )}
      keyExtractor={(item) => item.date}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
      }
    />
  )
}
