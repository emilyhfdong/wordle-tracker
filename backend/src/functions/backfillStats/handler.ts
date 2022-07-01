import { database } from "@libs/database"
import { config } from "@libs/environment"
import { getStatsForUser } from "@libs/utils"
import { Settings } from "luxon"

export const handler = async () => {
  Settings.defaultZone = config.timezone
  const users = await database.getAllUsers()

  for (let i = 0; i < users.length; i++) {
    const userId = users[i].pk
    console.log("building stats for user", users[i].name)
    const { dayEntries } = await database.getUserItems(userId)

    const stats = getStatsForUser(dayEntries)
    await database.putUserStats(userId, stats)
  }

  return
}
