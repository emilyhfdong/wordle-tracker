import { database } from "@libs/database"
import { config } from "@libs/environment"
import { expo } from "@libs/expo"
import Expo, { ExpoPushMessage } from "expo-server-sdk"
import { Settings } from "luxon"

export const handler = async () => {
  Settings.defaultZone = config.timezone
  const users = await database.getAllUsers()
  const currentSeason = (await database.getSeasons())[0]

  if (!currentSeason) {
    console.log("oops! no current season?")
  }
  const usersWithValidTokens = users.filter((user) =>
    Expo.isExpoPushToken(user.pushToken)
  )
  console.log(
    "Sending notifications to",
    usersWithValidTokens.map((user) => ({ id: user.pk, name: user.name }))
  )

  const messages: ExpoPushMessage[] = usersWithValidTokens.map((user) => ({
    to: user.pushToken,
    title: `Happy WORDZLE season ${Number(currentSeason.sk) + 1}!!`,
    body: `Season ${currentSeason.sk} has ended! Go see who won!`,
  }))

  const chunks = expo.chunkPushNotifications(messages)

  await Promise.all(
    chunks.map((chunk) => expo.sendPushNotificationsAsync(chunk))
  )

  return
}
