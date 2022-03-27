import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { connectToDb } from "src/db"

export const handler: APIGatewayProxyHandler = async (event) => {
  const body: { name?: string; pushToken?: string } = JSON.parse(event.body)
  const userId = event.pathParameters.userId

  const { User } = await connectToDb()

  console.log("finding user with id", userId)
  const user = await User.findByPk(userId)

  if (!user) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${userId} not found` },
    })
  }

  console.log("updating user", userId, "with", JSON.stringify(body))

  const updatedUser = await User.update(
    {
      ...(body.name && { name: body.name }),
      ...(body.pushToken && { pushToken: body.pushToken }),
    },
    { where: { id: userId }, returning: true }
  )

  return createResponse({
    body: { user: updatedUser },
  })
}
