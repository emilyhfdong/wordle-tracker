import { database } from "@libs/database"
import { config } from "@libs/environment"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { DateTime, Settings } from "luxon"

interface IEventBody {
  attemptsDetails: string
  word: { date: string; number: number; answer: string }
}

export const handler: APIGatewayProxyHandler = async (event) => {
  Settings.defaultZone = config.timezone
  const userId = event.pathParameters.userId

  const body = JSON.parse(event.body)

  if (
    !body.attemptsDetails ||
    !body.word?.date ||
    !body.word?.number ||
    !body.word?.answer
  ) {
    return createResponse({
      statusCode: 400,
      body: {
        message: `Missing required fields: date, attemptsDetails, word, number`,
      },
    })
  }

  const { attemptsDetails, word }: IEventBody = body

  console.log("finding user with id", userId, body)

  const user = await database.getUser(userId)
  if (!user) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${userId} not found` },
    })
  }

  const playedAt = DateTime.now().toUTC().toISO()

  console.log("updating day entry for user", userId)
  const attempts = attemptsDetails.split(" ")

  const lastAttempt = attempts[attempts.length - 1]
  const isFinalGuess = attempts.length === 6 || lastAttempt === word.answer

  const failed = lastAttempt !== word.answer && isFinalGuess

  const prevDayEntry = await database.getUserDayEntry(userId, word.date)

  const dayEntry = await database.putUserDayEntry(userId, {
    attemptsCount: attemptsDetails.split(" ").length + (failed ? 1 : 0),
    attemptsDetails,
    createdAt: prevDayEntry?.createdAt || playedAt,
    updatedAt: playedAt,
    word: word,
    isPartiallyCompleted: !isFinalGuess,
  })

  console.log("updated day entry for user", dayEntry)

  return createResponse({
    body: { dayEntry },
  })
}
