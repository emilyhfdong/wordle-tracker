import { database } from "@libs/database"
import {
  createResponse,
  getAverageAtempts,
  getCurrentStreak,
  getGuessDistribution,
  getLastAverages,
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

  const averageChanges = sortedDayEntries.reduce((acc, entry) => {
    const entriesOnAndBefore = sortedDayEntries.filter(
      (e) => DateTime.fromISO(e.word.date) <= DateTime.fromISO(entry.word.date)
    )
    const prevAvg = getAverageAtempts(entriesOnAndBefore.slice(1))
    const currentAvg = getAverageAtempts(entriesOnAndBefore)
    return {
      ...acc,
      [entry.word.date]: Number((currentAvg - prevAvg).toFixed(2)),
    }
  }, {} as { [date: string]: number })

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
      guessDistribution: getGuessDistribution(sortedDayEntries),
      datesPlayed,
      lastAverages: getLastAverages(sortedDayEntries),
      averageChanges,
    },
  })
}
