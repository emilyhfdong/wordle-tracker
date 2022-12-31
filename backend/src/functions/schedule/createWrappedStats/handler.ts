import { database } from "@libs/database"
import { DateTime } from "luxon"
import { getWrappedStats } from "./utils"

export const handler = async () => {
  const hour = DateTime.now().hour

  if (hour !== 0) {
    console.log("its not midnight, returning early")
    return
  }

  const users = await database.getAllUsers()
  const allWords = await database.getAllWords()
  const userItems = await Promise.all(
    users.map((user) => database.getUserItems(user.pk))
  )
  const firstDayOfSeason = DateTime.now().minus({ day: 1 }).startOf("quarter")
  const lastDayOfSeason = firstDayOfSeason.endOf("quarter")
  const daysInSeason = Math.floor(
    lastDayOfSeason.diff(firstDayOfSeason).as("days")
  )
  const rankingsByDay = new Array(daysInSeason).fill(0).map((_, idx) => {
    return userItems
      .filter((user) => user.stats.seasonAverages[idx] !== null)
      .sort((a, b) => {
        const aAverage = a.stats.seasonAverages[idx]
        const bAverage = b.stats.seasonAverages[idx]
        return (
          (aAverage ||
            a.stats.seasonAverages[a.stats.seasonAverages.length - 1]) -
          (bAverage ||
            b.stats.seasonAverages[a.stats.seasonAverages.length - 1])
        )
      })
      .map((user) => user.metadata.pk)
  })

  const seasonNumber = Math.floor(
    Math.abs(DateTime.fromISO("2022-04-01").diffNow().as("quarters"))
  ).toString()

  for (let i = 0; i < userItems.length; i++) {
    const user = userItems[i]
    const wrappedStats = getWrappedStats({ user, rankingsByDay, allWords })

    console.log("storing wrapped stats for", user.metadata.name)
    await database.putWrappedStats({
      userId: user.metadata.pk,
      stats: wrappedStats,
      seasonNumber,
      startDate: firstDayOfSeason.toISODate(),
      endDate: lastDayOfSeason.toISODate(),
    })
  }

  return
}
