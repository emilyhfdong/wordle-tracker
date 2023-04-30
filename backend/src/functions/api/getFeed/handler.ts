import { database } from "@libs/database"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { DateTime, Settings } from "luxon"
import { config } from "@libs/environment"
import { getGroupedDayEntries } from "../getGroupedFeed/utils"

export const handler: APIGatewayProxyHandler = async (event) => {
  Settings.defaultZone = config.timezone
  const userId = event.pathParameters.userId
  const page = Number(event.queryStringParameters.page) || 1

  const datePrefix = DateTime.now()
    .minus({ months: page - 1 })
    .toFormat("yyyy-MM")

  const [userMeta, userDayEntries] = await Promise.all([
    database.getUserMetadata(userId),
    database.getCompletedUserDayEntries(userId, datePrefix),
  ])

  if (!userMeta) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${userId} not found` },
    })
  }

  const friendItems = await Promise.all(
    userMeta.friendIds.map((friendId) =>
      database.getCompletedUserDayEntries(friendId, datePrefix)
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
      page,
    },
  })
}
