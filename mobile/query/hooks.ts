import { useQuery, useMutation } from "react-query"
import { BackendService } from "../services/backend"
import { TDayEntry } from "../services/types"

export enum QueryKeys {
  FEED = "feed",
  TODAYS_WORD = "todaysWord",
  USER = "user",
  FRIENDS = "friends",
  SEASONS = "seasons",
}

export const useFeed = (userId: string) => {
  return useQuery(QueryKeys.FEED, () => BackendService.getFeed(userId))
}

export const useTodaysWord = () => {
  return useQuery(QueryKeys.TODAYS_WORD, BackendService.getTodaysWord)
}

export const useUser = (userId: string) => {
  return useQuery(QueryKeys.USER, () => BackendService.getUser(userId))
}

export const useSeasons = () => {
  return useQuery(QueryKeys.SEASONS, () => BackendService.getSeasons())
}

export const useFriends = (userId: string) => {
  return useQuery(QueryKeys.FRIENDS, () => BackendService.getFriends(userId), {
    enabled: Boolean(userId),
  })
}

export const useCreateUser = (
  name: string,
  { onSuccess }: { onSuccess: (data: { id: string; name: string }) => void }
) => {
  return useMutation(() => BackendService.createUser(name), { onSuccess })
}

export const usecreateDayEntry = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation(
    ({ userId, TDayEntry }: { userId: string; TDayEntry: TDayEntry }) =>
      BackendService.createDayEntry(userId, TDayEntry),
    {
      onSuccess,
      retry: 3,
    }
  )
}

export const useAddFriend = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation(
    ({ userId, friendId }: { userId: string; friendId: string }) =>
      BackendService.addFriend(userId, friendId),
    {
      onSuccess,
    }
  )
}

export const usePingFriend = ({
  onSuccess,
  onMutate,
}: {
  onSuccess: () => void
  onMutate: () => void
}) => {
  return useMutation(
    ({ userId, friendId }: { userId: string; friendId: string }) =>
      BackendService.pingFriend(userId, friendId),
    {
      onSuccess,
      onMutate,
    }
  )
}
