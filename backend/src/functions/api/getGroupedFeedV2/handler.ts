import { database } from "@libs/database"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { getGroupedDayEntries } from "./utils"
import { Settings } from "luxon"
import { config } from "@libs/environment"

export const handler: APIGatewayProxyHandler = async (event) => {
  Settings.defaultZone = config.timezone
  const userId = event.pathParameters.userId

  const [userMeta, userDayEntries] = await Promise.all([
    database.getUserMetadata(userId),
    database.getAllUserDayEntries(userId),
  ])

  if (!userMeta) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${userId} not found` },
    })
  }

  const friendItems = await Promise.all(
    userMeta.friendIds.map((friendId) =>
      database.getAllUserDayEntries(friendId)
    )
  )

  const allEntries = friendItems.reduce(
    (acc, curr) => [...acc, ...curr],
    userDayEntries
  )

  allEntries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const dayEntriesByDate = getGroupedDayEntries(allEntries)

  return createResponse({
    body: {
      dayEntriesByDate,
    },
  })
}
