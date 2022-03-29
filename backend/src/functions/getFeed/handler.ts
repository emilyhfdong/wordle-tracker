import { database } from "@libs/database"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { getFriendDetails, getGroupedDayEntries } from "./utils"

export const handler: APIGatewayProxyHandler = async (event) => {
  const userId = event.pathParameters.userId
  console.log("finding user with id", userId)

  const user = await database.getUserItems(userId)
  if (!user) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${userId} not found` },
    })
  }

  console.log("getting friend entries for user", JSON.stringify(user))
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

  const dayEntriesByDate = getGroupedDayEntries(allEntries)

  return createResponse({
    body: { friends: friendItems.map(getFriendDetails), dayEntriesByDate },
  })
}
