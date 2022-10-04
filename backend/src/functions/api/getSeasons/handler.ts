import { database } from "@libs/database"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { Settings } from "luxon"
import { config } from "@libs/environment"

export const handler: APIGatewayProxyHandler = async () => {
  Settings.defaultZone = config.timezone

  const seasons = await database.getSeasons()

  return createResponse({
    body: seasons
      .map(({ leaderboard, startDate, endDate, sk }) => ({
        startDate,
        endDate,
        name: `Season ${sk}`,
        leaderboard,
      }))
      .sort(
        (a, b) => new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      ),
  })
}
