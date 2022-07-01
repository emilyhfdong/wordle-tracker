import {
  IDayEntryItem,
  IUserMetaDataItem,
  IUserStatsItem,
} from "@libs/database/types"
import { config } from "@libs/environment"
import { getCurrentStreak } from "@libs/utils"
import { DateTime, Settings } from "luxon"

interface IFriendDetails {
  userId: string
  name: string
  currentStreak: number
  lastPlayed: string
  averageAttemptsCount: number
  pingStatus: "notifications_disabled" | "already_pinged" | "ready"
  color: string
  lastAverages: number[]
}

const COLORS = ["#78CFA0", "#7DBCE8", "#C6449F", "#457AF9"]

export const getFriendDetails = ({
  dayEntries,
  metadata,
  userPingedFriendIds,
  index,
  stats,
}: {
  dayEntries: IDayEntryItem[]
  metadata: IUserMetaDataItem
  userPingedFriendIds: string[]
  stats: IUserStatsItem
  index: number
}): IFriendDetails => {
  Settings.defaultZone = config.timezone
  const sortedDayEntries = [...dayEntries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const currentStreak = getCurrentStreak(
    sortedDayEntries,
    DateTime.now().toISODate()
  )
  return {
    currentStreak,
    lastPlayed: stats.lastPlayed,
    averageAttemptsCount: stats.averageAttemptsCount,
    name: metadata.name,
    userId: metadata.pk,
    pingStatus: !metadata.pushToken
      ? "notifications_disabled"
      : userPingedFriendIds.includes(metadata.pk)
      ? "already_pinged"
      : "ready",
    color: COLORS[index % COLORS.length],
    lastAverages: stats.seasonAverages.slice(-30),
  }
}
