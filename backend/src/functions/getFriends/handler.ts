import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { connectToDb } from "src/db"

export const handler: APIGatewayProxyHandler = async (event) => {
  const userId = event.pathParameters.userId
  console.log("finding user with id", userId)
  const { User, Friendship } = await connectToDb()

  const user = await User.findByPk(userId)
  if (!user) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${userId} not found` },
    })
  }

  const friendships = await Friendship.findAll({
    where: { userId },
  })

  const friendIds = friendships.map((friendship) => friendship.friendId)

  const friends = await User.findAll({
    where: { id: [...friendIds] },
  })

  return createResponse({
    body: { friends },
  })
}
