import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { connectToDb } from "src/db"

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
  const { User, Friendship } = await connectToDb()

  const user = await User.findByPk(userId)
  if (!user) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${userId} not found` },
    })
  }

  console.log("finding user with id", userId)
  const friend = await User.findByPk(friendId)
  if (!friend) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${friendId} not found` },
    })
  }

  console.log("storing friendship to db")
  const friendship1 = await Friendship.create({ userId, friendId })
  await Friendship.create({
    userId: friendId,
    friendId: userId,
  })

  return createResponse({
    body: { friendship1 },
  })
}
