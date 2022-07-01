import { database } from "@libs/database"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { Settings } from "luxon"
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

  const {
    metadata: { name },
    stats,
  } = user

  return createResponse({
    body: {
      userId,
      name,
      maxStreak: stats.maxStreak,
      currentStreak: stats.currentStreak,
      winPercent: stats.winPercent,
      numberOfDaysPlayed: stats.numberOfDaysPlayed,
      lastPlayed: stats.lastPlayed,
      lastEntry: stats.lastEntry,
      guessDistribution: stats.guessDistribution,
      datesPlayed: stats.datesPlayed,
      lastAverages: stats.seasonAverages.slice(-30),
      averageChanges: stats.seasonAverageChanges,
      averageAttemptsCount: stats.averageAttemptsCount,
    },
  })
}
