import { database } from "@libs/database"
import { IDayEntryItem } from "@libs/database/types"
import { expo } from "@libs/expo"
import { DynamoDBStreamHandler } from "aws-lambda"
import { Converter } from "aws-sdk/clients/dynamodb"
import { Expo, ExpoPushMessage } from "expo-server-sdk"

export const getScoreDisplay = ({
  attemptsCount,
  hasPlayedThisDay,
}: {
  attemptsCount: number
  hasPlayedThisDay: boolean
}) => {
  if (!hasPlayedThisDay) {
    return "? / 6"
  }
  return attemptsCount <= 6 ? `${attemptsCount} / 6` : "X / 6"
}

export const handler: DynamoDBStreamHandler = async (streamEvent) => {
  const { Records } = streamEvent

  for (const record of Records) {
    if (record.eventName !== "INSERT" && record.eventName !== "MODIFY") {
      console.log("DynamoDB event not an INSERT or MODIFY, skipping")
      continue
    }

    if (!record.dynamodb?.NewImage) continue

    try {
      console.log("new entry")

      const newDayEntry = Converter.unmarshall(
        record.dynamodb.NewImage
      ) as IDayEntryItem

      if (!newDayEntry.sk.includes("day_entry")) {
        console.log("event is not a day_entry")
        continue
      }

      if (newDayEntry.isPartiallyCompleted) {
        console.log("day entry is not completed")
        continue
      }

      const user = await database.getUserItems(newDayEntry.pk)
      const { friendIds } = user.metadata
      console.log("found user with friends", user.metadata.friendIds)

      const friendItems = await Promise.all(
        friendIds.map(database.getUserItems)
      )
      const messages: ExpoPushMessage[] = friendItems
        .filter((friend) => Expo.isExpoPushToken(friend.metadata.pushToken))
        .map((friend) => {
          const hasPlayedThisDay = friend.stats.datesPlayed.includes(
            newDayEntry.word.date
          )
          const score = getScoreDisplay({
            attemptsCount: newDayEntry.attemptsCount,
            hasPlayedThisDay,
          })
          return {
            to: friend.metadata.pushToken,
            title: `${user.metadata.name} played today's wordzle`,
            body: hasPlayedThisDay
              ? `Wordzle ${newDayEntry.word.number} ${score}`
              : "? / 6 – Go play to see how they scored!",
            sound: "default",
          }
        })

      const chunks = expo.chunkPushNotifications(messages)

      await Promise.all(
        chunks.map((chunk) => expo.sendPushNotificationsAsync(chunk))
      )

      console.log("pushing notifications to", messages.length, "friends")
    } catch (error) {
      console.log("Error processing DynamoDB record", error)
      throw error
    }
  }

  console.log("Finished processing DynamoDB records")
}
