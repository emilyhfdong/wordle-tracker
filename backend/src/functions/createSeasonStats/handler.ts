import { database } from "@libs/database"
import { ISeasonItem } from "@libs/database/types"
import { config } from "@libs/environment"
import { getAverageAttemptsForSeason } from "@libs/utils"
import { DateTime, Settings } from "luxon"

export const handler = async () => {
  Settings.defaultZone = config.timezone

  const pastSeasons = await database.getSeasons()
  const lastSeason = pastSeasons?.[0] || null

  const seasonNumber = lastSeason ? Number(lastSeason.sk) + 1 : 1

  const users = await database.getAllUsers()

  const userItems = await Promise.all(
    users.map((user) => database.getUserItems(user.pk))
  )

  const leaderboard: ISeasonItem["leaderboard"] = userItems
    .filter(
      (user) =>
        user.dayEntries.length > 0 && !user.metadata.name.includes("dev")
    )
    .map((user) => ({
      average: getAverageAttemptsForSeason(
        user.dayEntries,
        DateTime.now().minus({ day: 1 }).toISODate()
      ),
      name: user.metadata.name,
      userId: user.metadata.pk,
    }))
    .sort((a, b) => a.average - b.average)

  await database.putSeason(
    leaderboard,
    DateTime.now().minus({ day: 1 }).startOf("quarter").toISODate(),
    DateTime.now().minus({ day: 1 }).endOf("quarter").toISODate(),
    seasonNumber.toString()
  )

  return
}
