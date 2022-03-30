import { useEffect, useState } from "react"
import { BackendService } from "../services/backend"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { feedActions, IFriends } from "../redux/slices/feed.slice"
import { dayEntriesActions, IDayEntry } from "../redux/slices/day-entries.slice"

const COLORS = ["#78CFA0", "#7DBCE8", "#C6449F", "#457AF9"]

export const useFeedRequest = () => {
  const userId = useAppSelector((state) => state.user.id)
  const groupedEntries = useAppSelector((state) => state.feed.groupedEntries)
  const friends = useAppSelector((state) => state.feed.friends)
  const dispatch = useAppDispatch()
  const [refetchCount, setRefetchCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const getAndSetFeed = async () => {
      setIsLoading(true)
      const feed = await BackendService.getFeed(userId)
      const friends = feed.friends.reduce(
        (acc, curr, index) => ({
          ...acc,
          [curr.userId]: {
            name: curr.name,
            color: COLORS[index % COLORS.length],
            currentStreak: curr.currentStreak,
            lastEntryDate: curr.lastPlayed,
            averageAttemptsCount: curr.averageAttemptsCount,
          },
        }),
        {} as IFriends
      )

      const userEntries = feed.dayEntriesByDate.reduce(
        (acc, curr) => [
          ...acc,
          ...curr.entries.filter((entry) => entry.userId === userId),
        ],
        [] as IDayEntry[]
      )

      dispatch(feedActions.setFriends(friends))
      dispatch(feedActions.setGroupedEntries(feed.dayEntriesByDate))
      dispatch(dayEntriesActions.setEntries(userEntries))
      setIsLoading(false)
    }

    if (userId) {
      getAndSetFeed()
    }
  }, [userId, refetchCount])

  return {
    friends,
    groupedEntries,
    refetch: () => setRefetchCount(refetchCount + 1),
    isLoading,
  }
}
