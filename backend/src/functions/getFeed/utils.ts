import { IDayEntryItem, IUserMetaDataItem } from "@libs/database/types"
import { config } from "@libs/environment"
import { getAverageAtempts, getCurrentStreak } from "@libs/utils"
import { DateTime, Settings } from "luxon"

interface IDateGroup {
  date: string
  entries: {
    userId: string
    attemptsCount: number
    attemptsDetails: string
    word: IDayEntryItem["word"]
    createdAt: string
  }[]
}

export const getGroupedDayEntries = (
  dayEntries: IDayEntryItem[]
): IDateGroup[] =>
  dayEntries.reduce(
    (acc, { pk: userId, attemptsCount, attemptsDetails, word, createdAt }) => {
      const newEntry: IDateGroup["entries"][0] = {
        userId,
        attemptsCount,
        attemptsDetails,
        word,
        createdAt,
      }

      const existingGroup = acc.find((group) => group.date === word.date)
      if (existingGroup) {
        return acc.map((group) =>
          group.date !== word.date
            ? group
            : { date: word.date, entries: [...group.entries, newEntry] }
        )
      }
      return [...acc, { date: word.date, entries: [newEntry] }]
    },
    [] as IDateGroup[]
  )

interface IFriendDetails {
  userId: string
  name: string
  currentStreak: number
  lastPlayed: string
  averageAttemptsCount: number
  pingStatus: "notifications_disabled" | "already_pinged" | "ready"
}

export const getFriendDetails = ({
  dayEntries,
  metadata,
  userPingedFriendIds,
}: {
  dayEntries: IDayEntryItem[]
  metadata: IUserMetaDataItem
  userPingedFriendIds: string[]
}): IFriendDetails => {
  Settings.defaultZone = config.timezone
  const sortedDayEntries = [...dayEntries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  return {
    currentStreak: getCurrentStreak(
      sortedDayEntries,
      DateTime.now().toISODate()
    ),
    lastPlayed: sortedDayEntries[0]?.createdAt,
    averageAttemptsCount: getAverageAtempts(sortedDayEntries),
    name: metadata.name,
    userId: metadata.pk,
    pingStatus: !metadata.pushToken
      ? "notifications_disabled"
      : userPingedFriendIds.includes(metadata.pk)
      ? "already_pinged"
      : "ready",
  }
}
