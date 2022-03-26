import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { connectToDb } from "src/db"

export const handler: APIGatewayProxyHandler = async (event) => {
  const userId = event.pathParameters.userId
  console.log("finding user with id", userId)
  const { User, Friendship, DayEntry } = await connectToDb()

  const user = await User.findByPk(userId)
  if (!user) {
    return createResponse({
      statusCode: 404,
      body: { message: `User ${userId} not found` },
    })
  }

  const friendships = await Friendship.findAll({
    where: { userId },
  })

  const friendIds = friendships.map((friendship) => friendship.friendId)

  const dayEntries = await DayEntry.findAll({
    where: { userId: [...friendIds, userId] },
    order: [["createdAt", "DESC"]],
  })

  interface IDateGroup {
    date: string
    entries: {
      userId: string
      attemptsCount: number
      attemptsDetails: string
      word: string
      number: number
      createdAt: string
    }[]
  }
  const dayEntriesByDate = dayEntries.reduce(
    (
      acc,
      { userId, attemptsCount, attemptsDetails, word, number, date, createdAt }
    ) => {
      const newEntry: IDateGroup["entries"][0] = {
        userId,
        attemptsCount,
        attemptsDetails,
        word,
        number,
        createdAt,
      }

      const existingGroup = acc.find((group) => group.date === date)
      if (existingGroup) {
        return acc.map((group) =>
          group.date !== date
            ? group
            : { date, entries: [...group.entries, newEntry] }
        )
      }
      return [...acc, { date, entries: [newEntry] }]
    },
    [] as IDateGroup[]
  )

  return createResponse({
    body: dayEntriesByDate,
  })
}
