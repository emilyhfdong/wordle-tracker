import { database } from "@libs/database"
import {
  createResponse,
  getAverageAtempts,
  getAverageChange,
  getCurrentStreak,
  getGuessDistribution,
  getLast30Averages,
  getMaxStreak,
  getWinPercent,
} from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { DateTime, Settings } from "luxon"
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
    dayEntries,
  } = user

  const todaysDate = DateTime.now().toISODate()

  const sortedDayEntries = [...dayEntries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const datesPlayed = sortedDayEntries.map((entry) => entry.word.date)
  const currentStreak = getCurrentStreak(sortedDayEntries, todaysDate)

  return createResponse({
    body: {
      userId,
      name,
      maxStreak: getMaxStreak(sortedDayEntries, todaysDate),
      currentStreak,
      averageAttemptsCount: getAverageAtempts(sortedDayEntries),
      winPercent: getWinPercent(sortedDayEntries),
      numberOfDaysPlayed: sortedDayEntries.length,
      lastPlayed: sortedDayEntries[0]?.createdAt,
      lastEntry: sortedDayEntries[0],
      averageChange: getAverageChange(sortedDayEntries, currentStreak),
      guessDistribution: getGuessDistribution(sortedDayEntries),
      datesPlayed,
      last30Averages: getLast30Averages(sortedDayEntries),
    },
  })
}
