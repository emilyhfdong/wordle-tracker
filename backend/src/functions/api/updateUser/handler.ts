import { database } from "@libs/database"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"

export const handler: APIGatewayProxyHandler = async (event) => {
  const body: { name?: string; pushToken?: string } = JSON.parse(event.body)
  const userId = event.pathParameters.userId

  console.log("finding user with id", userId)
  const user = await database.getUser(userId)

  if (!user) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${userId} not found` },
    })
  }

  console.log("updating user", userId, "with", JSON.stringify(body))

  const updatedUser = await database.putUser(userId, {
    pushToken: body.pushToken || user.pushToken,
    name: body.name || user.name,
    friendIds: user.friendIds,
  })

  return createResponse({
    body: { user: updatedUser },
  })
}
