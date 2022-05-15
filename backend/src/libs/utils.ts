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

export const getAverageChange = (
  dayEntries: IDayEntryItem[],
  currentStreak: number
) => {
  const todaysDate = DateTime.now().toISODate()
  if (dayEntries[0]?.word?.date !== todaysDate || currentStreak < 2) {
    return null
  }
  const prevAvg = getAverageAtempts(dayEntries.slice(1))
  const currentAvg = getAverageAtempts(dayEntries)
  return Number((currentAvg - prevAvg).toFixed(2))
}

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

export const getGuessDistribution = (dayEntries: IDayEntryItem[]) => {
  return new Array(6).fill(0).map((_, idx) => ({
    count: idx + 1,
    occurance: dayEntries.filter((entry) => entry.attemptsCount - 1 === idx)
      .length,
  }))
}

export const getLastAverages = (sortedDayEntries: IDayEntryItem[]) => {
  return new Array(30)
    .fill(null)
    .map((_, idx) => {
      const date = DateTime.now().minus({ days: idx }).startOf("day")
      const entries = sortedDayEntries.filter(
        (entry) => DateTime.fromISO(entry.word.date) <= date
      )
      if (!entries.length) {
        return null
      }
      return getAverageAtempts(entries)
    })
    .reverse()
}
