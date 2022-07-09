import { database } from "@libs/database"
import { createResponse, getStatsForUser } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"

const generateRandomId = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  return new Array(5)
    .fill(0)
    .map(() => letters[Math.floor(Math.random() * letters.length)])
    .join("")
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const body = JSON.parse(event.body)
  console.log("recieved body", event.body)
  if (!body.name) {
    return createResponse({
      body: { message: "Missing `name` field" },
      statusCode: 400,
    })
  }

  let isUnique = false
  let id = ""

  while (!isUnique) {
    id = generateRandomId()
    const existingUser = await database.getUser(id)
    isUnique = !existingUser
  }

  const user = await database.putUser(id, { name: body.name, friendIds: [] })
  const stats = getStatsForUser([])

  await database.putUserStats(id, stats)

  console.log("created user", user.name)
  return createResponse({
    body: {
      user: {
        id: user.pk,
        name: user.name,
      },
      stats,
    },
  })
}
