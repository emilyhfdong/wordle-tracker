import { useQuery, useMutation } from "react-query"
import { BackendService } from "../services/backend"
import { TDayEntry } from "../services/types"

export enum QueryKeys {
  FEED = "feed",
  TODAYS_WORD = "todaysWord",
  USER = "user",
  FRIENDS = "friends",
  SEASONS = "seasons",
  WRAPPED_STATS = "wrappedStats",
}

const DEFAULT_OPTIONS = {
  refetchOnMount: true,
  refetchOnWindowFocus: true,
  staleTime: 5 * 60 * 1000,
}

export const useFeed = (userId: string) => {
  return useQuery(QueryKeys.FEED, () => BackendService.getFeed(userId), {
    ...DEFAULT_OPTIONS,
  })
}

export const useTodaysWord = () => {
  return useQuery(
    QueryKeys.TODAYS_WORD,
    BackendService.getTodaysWord,
    DEFAULT_OPTIONS
  )
}

export const useUser = (userId: string) => {
  return useQuery(
    QueryKeys.USER,
    () => BackendService.getUser(userId),
    DEFAULT_OPTIONS
  )
}

export const useWrappedStats = (userId: string) => {
  return useQuery(
    QueryKeys.WRAPPED_STATS,
    () => BackendService.getWrappedStats(userId),
    DEFAULT_OPTIONS
  )
}

export const useSeasons = () => {
  return useQuery(
    QueryKeys.SEASONS,
    () => BackendService.getSeasons(),
    DEFAULT_OPTIONS
  )
}

export const useFriends = (userId: string) => {
  return useQuery(QueryKeys.FRIENDS, () => BackendService.getFriends(userId), {
    enabled: Boolean(userId),
    ...DEFAULT_OPTIONS,
  })
}

export const useCreateUser = (
  name: string,
  { onSuccess }: { onSuccess: (data: { id: string; name: string }) => void }
) => {
  return useMutation(() => BackendService.createUser(name), { onSuccess })
}

export const useCreateDayEntry = ({ onSuccess }: { onSuccess: () => void }) => {
  return useMutation(
    ({ userId, dayEntry }: { userId: string; dayEntry: TDayEntry }) =>
      BackendService.createDayEntry(userId, dayEntry),
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
