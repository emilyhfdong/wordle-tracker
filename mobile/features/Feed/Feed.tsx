import React, { useEffect, useState } from "react"
import {
  View,
  ScrollView,
  RefreshControl,
  InteractionManager,
  ActivityIndicator,
} from "react-native"

import { useAppSelector } from "../../redux"
import { useFeed, useFriends, useUser } from "../../query"
import { FullScreenLoading } from "../../shared"
import { FeedEmptyState, GroupedDayEntries } from "./components"
import { RH } from "../../utils"

export const Feed: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data, isLoading, refetch: refetchFeed } = useFeed(userId)
  const { refetch: refetchUser } = useUser(userId)
  const { isLoading: friendsIsLoading } = useFriends(userId)
  const [interationsIsLoading, setInteractionsIsLoading] = useState(true)
  const [isRefetching, setIsRefetching] = useState(false)
  const [page, setPage] = useState(1)

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

  const groupedEntries = data?.dayEntriesByDate.slice(0, 10 * page) || []
  const hasReachedEnd = data && data.dayEntriesByDate.length <= 10 * page

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F9F9F9",
        paddingHorizontal: 10,
      }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
      }
      onScroll={({
        nativeEvent: { layoutMeasurement, contentOffset, contentSize },
      }) => {
        if (
          layoutMeasurement.height + contentOffset.y >=
            contentSize.height - RH(5) &&
          !hasReachedEnd
        ) {
          setPage(page + 1)
        }
      }}
    >
      <View style={{ paddingTop: 5 }}>
        {groupedEntries.map((group, idx) => (
          <GroupedDayEntries group={group} key={idx} />
        ))}
        {groupedEntries.length && !hasReachedEnd && (
          <View
            style={{
              height: RH(5),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator />
          </View>
        )}
        {!groupedEntries.length && <FeedEmptyState />}
      </View>
    </ScrollView>
  )
}
