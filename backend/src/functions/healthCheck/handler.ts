import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { connectToDb } from "src/db"

export const handler: APIGatewayProxyHandler = async () => {
  await connectToDb()

  return createResponse({
    body: { message: "Successful connection" },
  })
}
