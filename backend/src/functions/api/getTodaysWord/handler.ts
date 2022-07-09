import { config } from "@libs/environment"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import * as AWS from "aws-sdk"
const dynamodb = new AWS.DynamoDB.DocumentClient()
import { DateTime, Settings } from "luxon"

export const handler: APIGatewayProxyHandler = async () => {
  Settings.defaultZone = config.timezone
  const todaysDate = DateTime.now().toISODate()
  console.log("finding entry for", todaysDate)
  const todaysWord = await dynamodb
    .get({
      TableName: config.wordHistoryTableName,
      Key: { date: todaysDate },
    })
    .promise()

  return createResponse({
    body: {
      word: todaysWord?.Item?.word || null,
      date: todaysDate,
      number: todaysWord?.Item?.number || null,
    },
  })
}
