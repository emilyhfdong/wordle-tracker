import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
  RefreshControl,
  InteractionManager,
  FlatList,
  View,
  TextInput,
  ListRenderItemInfo,
  TouchableOpacity,
} from "react-native"

import { useAppSelector } from "../../redux"
import { useFeed, useFriends, useUser } from "../../query"
import { FullScreenLoading } from "../../shared"
import { FeedEmptyState, GroupedDayEntries } from "./components"
import { theme } from "../../constants"
import { Ionicons } from "@expo/vector-icons"
import Fuse from "fuse.js"
import { TGroupedDayEntries } from "../../services"

const renderItem = ({ item }: ListRenderItemInfo<TGroupedDayEntries>) => (
  <GroupedDayEntries group={item} key={item.date} />
)

const keyExtractor = (item: TGroupedDayEntries) => item.date

export const Feed: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data, isLoading, refetch: refetchFeed } = useFeed(userId)
  const { refetch: refetchUser, data: userData } = useUser(userId)
  const { isLoading: friendsIsLoading } = useFriends(userId)
  const [interationsIsLoading, setInteractionsIsLoading] = useState(true)
  const [isRefetching, setIsRefetching] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const todaysDate = useAppSelector((state) => state.todaysWord.date)
  const onRefresh = useCallback(async () => {
    setIsRefetching(true)
    await Promise.all([refetchFeed(), refetchUser()])
    setIsRefetching(false)
  }, [refetchFeed, refetchUser])

  useEffect(() => {
    InteractionManager.runAfterInteractions(() =>
      setInteractionsIsLoading(false)
    )
  }, [])

  const fuse = useMemo(
    () => new Fuse(data?.dayEntriesByDate || [], { keys: ["correctAnswer"] }),
    [data?.dayEntriesByDate]
  )

  const flatlistData = useMemo(
    () =>
      searchTerm
        ? fuse
            .search(searchTerm)
            .map(({ item }) => item)
            .filter(
              (item) =>
                item.date !== todaysDate ||
                userData?.lastEntry.word.date === todaysDate
            )
        : data?.dayEntriesByDate,
    [searchTerm, data?.dayEntriesByDate]
  )

  if (isLoading || friendsIsLoading || interationsIsLoading) {
    return <FullScreenLoading />
  }

  if (!data?.dayEntriesByDate.length) {
    return <FeedEmptyState />
  }

  return (
    <FlatList
      data={flatlistData}
      style={{
        flex: 1,
        backgroundColor: "#F9F9F9",
        paddingHorizontal: 10,
        paddingTop: 5,
      }}
      initialNumToRender={5}
      removeClippedSubviews
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
      }
      maxToRenderPerBatch={1}
      ListHeaderComponent={
        <View
          style={{
            borderColor: "#E6E6E6",
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: theme.light.background,
            width: "100%",
            paddingHorizontal: 10,
            paddingVertical: 15,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Ionicons
            style={{ marginRight: 5 }}
            name={"search"}
            size={20}
            color={theme.light.grey}
          />

          <TextInput
            style={{
              fontSize: 18,
              flex: 1,
              color: theme.light.grey,
            }}
            placeholderTextColor={theme.light.lightGrey}
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
            returnKeyType="go"
            placeholder="Search"
          />
          {!!searchTerm && (
            <TouchableOpacity onPress={() => setSearchTerm("")}>
              <Ionicons
                style={{ marginLeft: 5 }}
                name={"close-circle-outline"}
                size={20}
                color={theme.light.grey}
              />
            </TouchableOpacity>
          )}
        </View>
      }
    />
  )
}
