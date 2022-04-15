import { DateTime } from "luxon"
import { IDayEntryItem } from "./database/types"

export const createResponse = ({
  statusCode,
  body,
}: {
  statusCode?: number
  body: any
}) => ({
  statusCode: statusCode || 200,
  body: JSON.stringify(body),
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
  },
})

export const getCurrentStreak = (
  dayEntries: IDayEntryItem[],
  todaysDate: string
) => {
  let streak = 0
  if (!dayEntries.length) {
    return streak
  }

  let date =
    dayEntries[0].word.date === todaysDate
      ? todaysDate
      : DateTime.fromISO(todaysDate).minus({ days: 1 }).toISODate()

  for (let i = 0; i < dayEntries.length; i++) {
    console.log("hii day entry date", dayEntries[i].word.date)
    if (dayEntries[i].word.date !== date) {
      return streak
    }
    streak += 1
    date = DateTime.fromISO(date).minus({ days: 1 }).toISODate()
  }
  return streak
}

export const getAverageAtempts = (dayEntries: IDayEntryItem[]) =>
  Number(
    (
      dayEntries.reduce((acc, curr) => acc + curr.attemptsCount, 0) /
      dayEntries.length
    ).toFixed(2)
  )

export const getMaxStreak = (
  dayEntries: IDayEntryItem[],
  todaysDate: string
) => {
  let streak = 0
  let date = todaysDate
  for (let i = 0; i < dayEntries.length; i++) {
    streak += dayEntries[i].word.date === date ? 1 : 0
    date = DateTime.fromISO(date).minus({ days: 1 }).toISODate()
  }
  return streak
}

export const getWinPercent = (dayEntries: IDayEntryItem[]) => {
  const wonEntries = dayEntries.filter((entry) => entry.attemptsCount <= 6)
  return Math.round((wonEntries.length / dayEntries.length) * 100)
}
