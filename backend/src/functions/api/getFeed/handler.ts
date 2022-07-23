import { database } from "@libs/database"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { DateTime, Settings } from "luxon"
import { config } from "@libs/environment"
import { Timer } from "@libs/timer"
import { getGroupedDayEntries } from "../getGroupedFeed/utils"

export const handler: APIGatewayProxyHandler = async (event) => {
  Settings.defaultZone = config.timezone
  const userId = event.pathParameters.userId
  const page = Number(event.queryStringParameters.page) || 1
  const timer = new Timer()

  const datePrefix = DateTime.now()
    .minus({ months: page - 1 })
    .toFormat("yyyy-MM")

  const [userMeta, userDayEntries] = await Promise.all([
    database.getUserMetadata(userId),
    database.getUserDayEntries(userId, datePrefix),
  ])

  console.log("hii got meta + day", timer.getTimeSinceLastStop())

  if (!userMeta) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${userId} not found` },
    })
  }

  const friendItems = await Promise.all(
    userMeta.friendIds.map((friendId) =>
      database.getUserDayEntries(friendId, datePrefix)
    )
  )
  console.log("hii got friend entries", timer.getTimeSinceLastStop())

  const allEntries = friendItems.reduce(
    (acc, curr) => [...acc, ...curr],
    userDayEntries
  )

  allEntries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const dayEntriesByDate = getGroupedDayEntries(allEntries)

  console.log("hii formatted entries", timer.getTimeSinceLastStop())
  console.log("hii total time", timer.getTotalDuration())
  return createResponse({
    body: {
      dayEntriesByDate,
    },
  })
}
