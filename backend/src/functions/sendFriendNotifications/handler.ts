import { database } from "@libs/database"
import { IDayEntryItem } from "@libs/database/types"
import { DynamoDBStreamHandler } from "aws-lambda"
import { Converter } from "aws-sdk/clients/dynamodb"
import { Expo, ExpoPushMessage } from "expo-server-sdk"

const expo = new Expo()

export const getTileEmoji = ({
  letter,
  word,
  index,
}: {
  letter: string
  word: string
  index: number
}) => {
  if (word[index] === letter) return "🟩"
  if (letter && word.includes(letter)) return "🟨"
  return "⬜"
}

const getSquares = (guesses: string[], word: string) => {
  return guesses
    .map(
      (guess) =>
        `${guess
          .split("")
          .map((letter, index) => getTileEmoji({ index, letter, word }))
          .join("")}`
    )
    .join("\r\n")
}

export const handler: DynamoDBStreamHandler = async (streamEvent) => {
  const { Records } = streamEvent

  for (const record of Records) {
    if (record.eventName !== "INSERT") {
      console.log("DynamoDB event not an INSERT, skipping")
      continue
    }

    if (!record.dynamodb?.NewImage) continue

    try {
      console.log("new entry", record.dynamodb.NewImage)

      const newDayEntry = Converter.unmarshall(
        record.dynamodb.NewImage
      ) as IDayEntryItem

      if (!newDayEntry.sk.includes("day_entry")) {
        console.log("event is not a day_entry")
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
        .map((friend) => ({
          to: friend.metadata.pushToken,
          title: `${user.metadata.name} played today's wordzle`,
          body: `Wordzle ${newDayEntry.word.number} ${
            newDayEntry.attemptsCount
          }/6\n\n${getSquares(
            newDayEntry.attemptsDetails.split(" "),
            newDayEntry.word.answer
          )}`,
        }))

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
