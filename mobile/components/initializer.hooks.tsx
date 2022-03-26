import { useEffect, useState } from "react"
import { BackendService } from "../services/backend"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { feedActions, IFriends } from "../redux/slices/feed.slice"
import { theme } from "../constants/theme"

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
      const groupedEntries = await BackendService.getGroupedEntries(userId)
      const friendsResponse = await BackendService.getFriends(userId)
      const friends = friendsResponse.reduce(
        (acc, curr, index) => ({
          ...acc,
          [curr.id]: { name: curr.name, color: COLORS[index % COLORS.length] },
        }),
        {} as IFriends
      )
      dispatch(feedActions.setGroupedEntries(groupedEntries))
      dispatch(feedActions.setFriends(friends))
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
