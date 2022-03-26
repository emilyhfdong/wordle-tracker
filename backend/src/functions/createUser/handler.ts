import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { connectToDb } from "src/db"

const generateRandomId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  return new Array(5)
    .fill(0)
    .map(() => letters[Math.floor(Math.random() * letters.length)])
    .join("")
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body)
  if (!body.name) {
    return createResponse({
      body: { message: "Missing `name` field" },
      statusCode: 400,
    })
  }

  const { User } = await connectToDb()

  let isUnique = false
  let id = ""

  while (!isUnique) {
    id = generateRandomId()
    const existingUser = await User.findByPk(id)
    isUnique = !existingUser
  }

  const user = await User.create({ id, name: body.name })

  return createResponse({
    body: { user },
  })
}
