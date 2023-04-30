import { database } from "@libs/database"
import { IDayEntryItem } from "@libs/database/types"
import { getStatsForUser } from "@libs/utils"
import { DynamoDBStreamHandler } from "aws-lambda"
import { Converter } from "aws-sdk/clients/dynamodb"

export const handler: DynamoDBStreamHandler = async (streamEvent) => {
  const { Records } = streamEvent

  for (const record of Records) {
    if (record.eventName !== "INSERT" && record.eventName !== "MODIFY") {
      console.log("DynamoDB event not an INSERT, skipping")
      continue
    }

    if (!record.dynamodb?.NewImage) continue

    console.log("new entry", record.dynamodb.NewImage)

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

    console.log("getting user items")
    const { completedDayEntries } = await database.getUserItems(newDayEntry.pk)

    console.log("creating stats for user")
    const stats = getStatsForUser(completedDayEntries)
    await database.putUserStats(newDayEntry.pk, stats)
  }

  console.log("Finished processing DynamoDB records")
}
