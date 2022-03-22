import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { connectToDb } from "src/db"

interface IEventBody {
  date: string
  attemptsCount: number
  attemptsDetails: string
  word: string
  number: number
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const userId = event.pathParameters.userId

  const body = JSON.parse(event.body)

  if (
    !body.date ||
    !body.attemptsCount ||
    !body.attemptsDetails ||
    !body.word ||
    !body.number
  ) {
    return createResponse({
      statusCode: 400,
      body: {
        message: `Missing required fields: date, attemptsCount, attemptsDetails, word, number`,
      },
    })
  }

  const { attemptsCount, attemptsDetails, date, number, word }: IEventBody =
    body

  console.log("finding user with id", userId)
  const { User, DayEntry } = await connectToDb()

  const user = await User.findByPk(userId)
  if (!user) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${userId} not found` },
    })
  }

  console.log("creating day entry for user", user.id)
  const dayEntry = await DayEntry.create({
    userId,
    attemptsCount,
    attemptsDetails,
    date,
    number,
    word,
  })

  return createResponse({
    body: { dayEntry },
  })
}
