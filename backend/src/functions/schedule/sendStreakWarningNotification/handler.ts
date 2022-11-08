import { database } from "@libs/database"
import { config } from "@libs/environment"
import { expo } from "@libs/expo"
import Expo, { ExpoPushMessage } from "expo-server-sdk"
import { DateTime, Settings } from "luxon"

export const handler = async () => {
  Settings.defaultZone = config.timezone
  const hour = DateTime.now().hour

  if (hour !== 23) {
    console.log("its not 11pm, returning early")
    return
  }

  const users = await database.getAllUsers()

  const userItems = await Promise.all(
    users.map((user) => database.getUserMetadataStats(user.pk))
  )

  const todaysDate = DateTime.now().toISODate()

  const usersWhoHaventPlayed = userItems.filter(
    (user) =>
      Expo.isExpoPushToken(user.metadata.pushToken) &&
      !user.stats.datesPlayed.includes(todaysDate) &&
      user.stats.datesPlayed.includes(
        DateTime.now().minus({ day: 1 }).toISODate()
      ) &&
      user.stats.currentStreak
  )

  console.log(
    "Sending notifications to",
    usersWhoHaventPlayed.map((user) => ({
      id: user.metadata.pk,
      name: user.metadata.name,
    }))
  )

  const messages: ExpoPushMessage[] = usersWhoHaventPlayed.map((user) => ({
    to: user.metadata.pushToken,
    title: `🚨 You're about to lose your ${user.stats.currentStreak} day streak! 🚨`,
    body: `Play today's wordzle to keep it alive!`,
    sound: "default",
  }))

  const chunks = expo.chunkPushNotifications(messages)

  await Promise.all(
    chunks.map((chunk) => expo.sendPushNotificationsAsync(chunk))
  )

  return
}
