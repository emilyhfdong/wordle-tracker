import { database } from "@libs/database"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { Settings } from "luxon"
import { config } from "@libs/environment"

export const handler: APIGatewayProxyHandler = async (event) => {
  Settings.defaultZone = config.timezone

  const userId = event.pathParameters.userId
  const wrappedStats = await database.getUserWrappedStats(userId)

  const mostRecentStats = wrappedStats.sort((a, b) => {
    const aSeasonNumber = Number(a.sk.split("#")[1])
    const bSeasonNumber = Number(b.sk.split("#")[1])

    return bSeasonNumber - aSeasonNumber
  })[0]

  return createResponse({
    body: mostRecentStats,
  })
}
