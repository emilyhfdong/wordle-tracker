import { database } from "@libs/database"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"

interface IEventBody {
  friendId: string
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const userId = event.pathParameters.userId

  const body = JSON.parse(event.body)
  if (!body.friendId) {
    return createResponse({
      statusCode: 400,
      body: {
        message: `Missing required field: friendId`,
      },
    })
  }

  const { friendId }: IEventBody = body

  console.log("finding user with id", userId)

  const user = await database.getUser(userId)
  if (!user) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${userId} not found` },
    })
  }

  console.log("finding friend with id", friendId)

  const friend = await database.getUser(friendId)
  if (!friend) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${friendId} not found` },
    })
  }

  if (user.friendIds.includes(friendId)) {
    console.log("already friends... returning early")
    return createResponse({
      body: { user, friend },
    })
  }

  console.log("storing updating friendIds")
  const updatedUser = await database.putUser(userId, {
    ...user,
    friendIds: [...user.friendIds, friendId],
  })
  const updateFriend = await database.putUser(friendId, {
    ...friend,
    friendIds: [...friend.friendIds, userId],
  })

  return createResponse({
    body: { user: updatedUser, friend: updateFriend },
  })
}
