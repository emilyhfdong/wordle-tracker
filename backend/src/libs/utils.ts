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

export const getAverageAttemptsForSeason = (
  dayEntries: IDayEntryItem[],
  todaysDate: string
) => {
  if (!dayEntries.length) {
    return 0
  }

  const scoreMap = dayEntries.reduce(
    (acc, curr) => ({ ...acc, [curr.word.date]: curr.attemptsCount }),
    {} as { [date: string]: number }
  )
  const sortedDayEntries = getSortedDayEntries(dayEntries)

  const firstEntryDate = sortedDayEntries[sortedDayEntries.length - 1].word.date

  let date = DateTime.fromISO(todaysDate).startOf("quarter").toISODate()

  let totalScore = 0
  let totalDays = 0
  while (
    DateTime.fromISO(todaysDate).diff(DateTime.fromISO(date)).as("days") >= 0
  ) {
    if (
      DateTime.fromISO(date)
        .diff(DateTime.fromISO(firstEntryDate))
        .as("days") >= 0
    ) {
      if (scoreMap[date] || date !== todaysDate) {
        totalScore += scoreMap[date] || 7
        totalDays += 1
      }
    }
    date = DateTime.fromISO(date).plus({ days: 1 }).toISODate()
  }
  if (totalDays === 0) {
    return 7
  }
  return Number((totalScore / totalDays).toFixed(2))
}

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
  if (!dayEntries.length) {
    return 0
  }
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

export const getSeasonAverages = (sortedDayEntries: IDayEntryItem[]) => {
  try {
    const seasonStart = DateTime.now().startOf("quarter")
    const days = Math.ceil(DateTime.now().diff(seasonStart).as("days"))

    const seasonAverages = new Array(days)
      .fill(null)
      .map((_, idx) => {
        const date = DateTime.now().minus({ days: idx }).startOf("day")

        const entries = sortedDayEntries.filter(
          (entry) => DateTime.fromISO(entry.word.date) <= date
        )
        if (!entries.length) {
          return null
        }
        return getAverageAttemptsForSeason(entries, date.toISODate())
      })
      .reverse()

    return seasonAverages
  } catch (e) {
    return []
  }
}

export const getSortedDayEntries = (dayEntries: IDayEntryItem[]) => {
  return [...dayEntries].sort(
    (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
  )
}

export const getStatsForUser = (dayEntries: IDayEntryItem[]) => {
  const todaysDate = DateTime.now().toISODate()

  const sortedDayEntries = [...dayEntries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const datesPlayed = sortedDayEntries.map((entry) => entry.word.date)
  const currentStreak = getCurrentStreak(sortedDayEntries, todaysDate)
  const seasonAverages = getSeasonAverages(sortedDayEntries)

  const seasonAverageChanges = sortedDayEntries.reduce((acc, entry) => {
    const entriesOnAndBefore = sortedDayEntries.filter(
      (e) => DateTime.fromISO(e.word.date) <= DateTime.fromISO(entry.word.date)
    )
    const prevAvg = getAverageAttemptsForSeason(
      entriesOnAndBefore.slice(1),
      DateTime.fromISO(entry.word.date).minus({ days: 1 }).toISODate()
    )
    const currentAvg = getAverageAttemptsForSeason(
      entriesOnAndBefore,
      DateTime.fromISO(entry.word.date).toISODate()
    )
    return {
      ...acc,
      [entry.word.date]: Number((currentAvg - prevAvg).toFixed(2)),
    }
  }, {} as { [date: string]: number })

  const stats = {
    maxStreak: getMaxStreak(sortedDayEntries, todaysDate),
    currentStreak,
    averageAttemptsCount: seasonAverages[seasonAverages.length - 1],
    winPercent: getWinPercent(sortedDayEntries),
    numberOfDaysPlayed: sortedDayEntries.length,
    lastPlayed: sortedDayEntries[0]?.createdAt,
    lastEntry: sortedDayEntries[0],
    guessDistribution: getGuessDistribution(sortedDayEntries),
    datesPlayed,
    seasonAverages,
    seasonAverageChanges,
  }

  return stats
}
