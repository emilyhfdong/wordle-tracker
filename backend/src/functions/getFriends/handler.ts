import { config } from "@libs/environment"
import { createResponse } from "@libs/utils"
import { APIGatewayProxyHandler } from "aws-lambda"
import { DateTime, Settings } from "luxon"
import { connectToDb, UserInstance, DayEntryInstance } from "src/db"

export const getCurrentStreak = (
  dayEntries: DayEntryInstance[],
  todaysDate: string
) => {
  let streak = 0
  if (!dayEntries.length) {
    return streak
  }
  let date =
    dayEntries[0].date === todaysDate
      ? todaysDate
      : DateTime.fromISO(todaysDate).minus({ days: 1 }).toISODate()

  for (let i = 0; i < dayEntries.length; i++) {
    if (dayEntries[i].date !== date) {
      return streak
    }
    streak += 1
    date = DateTime.fromISO(date).minus({ days: 1 }).toISODate()
  }
  return streak
}
export const handler: APIGatewayProxyHandler = async (event) => {
  Settings.defaultZone = config.timezone
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

  const friends = await User.findAll({
    where: { id: [...friendIds] },
  })

  const getFriendDetails = async (friend: UserInstance) => {
    const dayEntries = await DayEntry.findAll({
      where: { userId: friend.id },
      order: [["createdAt", "DESC"]],
    })

    const lastEntryDate = dayEntries[0]?.createdAt

    const currentStreak = getCurrentStreak(
      dayEntries,
      DateTime.now().toISODate()
    )
    return { id: friend.id, name: friend.name, lastEntryDate, currentStreak }
  }

  const friendDetails = await Promise.all(friends.map(getFriendDetails))

  return createResponse({
    body: friendDetails,
  })
}
