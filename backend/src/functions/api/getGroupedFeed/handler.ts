import { database } from "@libs/database"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { getGroupedDayEntries } from "./utils"
import { Settings } from "luxon"
import { config } from "@libs/environment"
import { Timer } from "@libs/timer"

// export const handler: APIGatewayProxyHandler = async (event) => {
//   Settings.defaultZone = config.timezone
//   const userId = event.pathParameters.userId
//   const timer = new Timer()

//   const [userMeta, userDayEntries] = await Promise.all([
//     database.getUserMetadata(userId),
//     database.getUserDayEntries(userId),
//   ])

//   console.log("hii got meta + day", timer.getTimeSinceLastStop())

//   if (!userMeta) {
//     return createResponse({
//       statusCode: 404,
//       body: { message: `User ${userId} not found` },
//     })
//   }

//   const friendItems = await Promise.all(
//     userMeta.friendIds.map((friendId) => database.getUserDayEntries(friendId))
//   )
//   console.log("hii got friend entries", timer.getTimeSinceLastStop())

//   const allEntries = friendItems.reduce(
//     (acc, curr) => [...acc, ...curr],
//     userDayEntries
//   )

//   allEntries.sort(
//     (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//   )

//   const dayEntriesByDate = getGroupedDayEntries(allEntries)

//   console.log("hii formatted entries", timer.getTimeSinceLastStop())
//   console.log("hii total time", timer.getTotalDuration())
//   return createResponse({
//     body: {
//       dayEntriesByDate,
//     },
//   })
// }

export const handler: APIGatewayProxyHandler = async (event) => {
  Settings.defaultZone = config.timezone
  const userId = event.pathParameters.userId
  const timer = new Timer()

  const user = await database.getUserItems(userId)
  console.log("hii got user", timer.getTimeSinceLastStop())
  if (!user) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${userId} not found` },
    })
  }

  console.log("getting friend entries for user", user.metadata.name)
  const friendItems = await Promise.all(
    user.metadata.friendIds.map((friendId) => database.getUserItems(friendId))
  )
  console.log("hii got friend items", timer.getTimeSinceLastStop())

  const allEntries = friendItems.reduce(
    (acc, curr) => [...acc, ...curr.dayEntries],
    user.dayEntries
  )

  allEntries.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  console.log("hii formatted", timer.getTimeSinceLastStop())
  console.log("hii TOTAL", timer.getTotalDuration())

  // TODO - paginate this request
  const dayEntriesByDate = getGroupedDayEntries(allEntries)

  return createResponse({
    body: {
      dayEntriesByDate,
    },
  })
}
