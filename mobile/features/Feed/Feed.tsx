import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  InteractionManager,
} from "react-native"

import { useAppSelector } from "../../redux"
import { useFeed, useFriends } from "../../query"
import { FullScreenLoading } from "../../shared"
import { GroupedDayEntries } from "./components"

export const Feed: React.FC = () => {
  const userId = useAppSelector((state) => state.user.id)
  const { data, isLoading, refetch, isRefetching } = useFeed(userId)
  const { isLoading: friendsIsLoading } = useFriends(userId)
  const [screenIsLoaded, setScreenIsLoaded] = useState(false)

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => setScreenIsLoaded(true))
  }, [])

  if (isLoading || friendsIsLoading || !screenIsLoaded) {
    return <FullScreenLoading />
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#F9F9F9",
        transform: [{ scaleY: -1 }],
        paddingHorizontal: 10,
      }}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
      }
    >
      <View style={{ transform: [{ scaleY: -1 }], paddingTop: 20 }}>
        {data?.dayEntriesByDate
          ?.slice()
          .reverse()
          ?.map((group, idx) => (
            <GroupedDayEntries group={group} key={idx} />
          ))}
        {!data?.dayEntriesByDate?.length && (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: 600,
            }}
          >
            <Text style={{ fontSize: 50, marginBottom: 10 }}>✨</Text>
            <Text
              style={{
                fontSize: 20,
                textAlign: "center",
                marginBottom: 30,
              }}
            >
              Your results and your friend's results will show up here!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}
