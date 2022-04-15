import { database } from "@libs/database"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { getFriendDetails } from "./utils"
import { DateTime, Settings } from "luxon"
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

  console.log("getting friend entries for user", JSON.stringify(user))
  const friendItems = await Promise.all(
    user.metadata.friendIds.map((friendId) => database.getUserItems(friendId))
  )

  const userPingedFriendIds = user.initiatedPings
    .filter((ping) =>
      ping.sk.includes(`initiated_ping#${DateTime.now().toISODate()}`)
    )
    .map((ping) => ping.sk.split("#")[ping.sk.split("#").length - 1])

  const friendsList = friendItems.map((item, index) =>
    getFriendDetails({ ...item, userPingedFriendIds, index })
  )

  const friendsMap = friendsList.reduce(
    (acc, curr) => ({ ...acc, [curr.userId]: curr }),
    {}
  )

  return createResponse({
    body: friendsMap,
  })
}
