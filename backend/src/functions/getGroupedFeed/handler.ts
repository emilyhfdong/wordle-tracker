import { database } from "@libs/database"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { getGroupedDayEntries } from "./utils"
import { Settings } from "luxon"
import { config } from "@libs/environment"

export const handler: APIGatewayProxyHandler = async (event) => {
  Settings.defaultZone = config.timezone
  const userId = event.pathParameters.userId
  console.log("finding user with id", userId)

  const user = await database.getUserItems(userId)
  if (!user) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${userId} not found` },
    })
  }

  console.log("getting friend entries for user", user.metadata.name)
  const friendItems = await Promise.all(
    user.metadata.friendIds.map((friendId) => database.getUserItems(friendId))
  )

  const allEntries = friendItems.reduce(
    (acc, curr) => [...acc, ...curr.dayEntries],
    user.dayEntries
  )

  allEntries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  // TODO - paginate this request
  const dayEntriesByDate = getGroupedDayEntries(allEntries)

  return createResponse({
    body: {
      dayEntriesByDate,
    },
  })
}
