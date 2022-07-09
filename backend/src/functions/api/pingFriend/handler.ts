import { database } from "@libs/database"
import { config } from "@libs/environment"
import { expo } from "@libs/expo"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { DateTime, Settings } from "luxon"

export const handler: APIGatewayProxyHandler = async (event) => {
  Settings.defaultZone = config.timezone

  const userId = event.pathParameters.userId
  const friendId = event.pathParameters.friendId
  if (!userId || !friendId) {
    return createResponse({
      body: { message: "Missing required path params `friendId` & `userId`" },
      statusCode: 400,
    })
  }

  console.log("finding user with id", userId)

  const user = await database.getUser(userId)
  if (!user) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${userId} not found` },
    })
  }

  if (!user.friendIds.includes(friendId)) {
    return createResponse({
      statusCode: 400,
      body: { message: `${friendId} is not a friend` },
    })
  }

  console.log("finding friend with user", friendId)
  const friend = await database.getUser(friendId)

  if (!friend.pushToken) {
    return createResponse({
      statusCode: 400,
      body: {
        message: `${friendId} does not have push notifications set up`,
      },
    })
  }

  console.log("sending push notifications to", friend.pushToken)
  await expo.sendPushNotificationsAsync([
    { to: friend.pushToken, title: user.name, body: "Play today's wordzle!!" },
  ])

  const todaysDate = DateTime.now().toISODate()

  console.log("storing pings in database")
  await database.createInitiatedPing(userId, friendId, todaysDate)
  await database.createRecievedPing(friendId, userId, todaysDate)

  return createResponse({
    body: { message: "Successfully sent notification" },
  })
}
