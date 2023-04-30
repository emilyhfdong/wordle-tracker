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

const getCurrentStreak = (
  sortedCompletedDayEntries: IDayEntryItem[],
  todaysDate: string
) => {
  let streak = 0
  if (!sortedCompletedDayEntries.length) {
    return streak
  }

  let date =
    sortedCompletedDayEntries[0].word.date === todaysDate
      ? todaysDate
      : DateTime.fromISO(todaysDate).minus({ days: 1 }).toISODate()

  for (let i = 0; i < sortedCompletedDayEntries.length; i++) {
    if (sortedCompletedDayEntries[i].word.date !== date) {
      return streak
    }
    streak += 1
    date = DateTime.fromISO(date).minus({ days: 1 }).toISODate()
  }
  return streak
}

export const getAverageAttemptsForSeason = (
  completedDayEntries: IDayEntryItem[],
  todaysDate: string
) => {
  if (!completedDayEntries.length) {
    return 0
  }

  const scoreMap = completedDayEntries.reduce(
    (acc, curr) => ({ ...acc, [curr.word.date]: curr.attemptsCount }),
    {} as { [date: string]: number }
  )
  const sortedDayEntries = getSortedDayEntries(completedDayEntries)

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

const getMaxStreak = (
  sortedCompletedDayEntries: IDayEntryItem[],
  todaysDate: string
) => {
  let streak = 0
  let date = todaysDate
  for (let i = 0; i < sortedCompletedDayEntries.length; i++) {
    streak += sortedCompletedDayEntries[i].word.date === date ? 1 : 0
    date = DateTime.fromISO(date).minus({ days: 1 }).toISODate()
  }
  return streak
}

const getWinPercent = (sortedCompletedDayEntries: IDayEntryItem[]) => {
  if (!sortedCompletedDayEntries.length) {
    return 0
  }
  const wonEntries = sortedCompletedDayEntries.filter(
    (entry) => entry.attemptsCount <= 6
  )
  return Math.round(
    (wonEntries.length / sortedCompletedDayEntries.length) * 100
  )
}

const getGuessDistribution = (sortedCompletedDayEntries: IDayEntryItem[]) => {
  return new Array(6).fill(0).map((_, idx) => ({
    count: idx + 1,
    occurance: sortedCompletedDayEntries.filter(
      (entry) => entry.attemptsCount - 1 === idx
    ).length,
  }))
}

const getSeasonAverages = (sortedCompletedDayEntries: IDayEntryItem[]) => {
  try {
    const seasonStart = DateTime.now().startOf("quarter")
    const days = Math.ceil(DateTime.now().diff(seasonStart).as("days"))

    const seasonAverages = new Array(days)
      .fill(null)
      .map((_, idx) => {
        const date = DateTime.now().minus({ days: idx }).startOf("day")

        const entries = sortedCompletedDayEntries.filter(
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

const getSortedDayEntries = (dayEntries: IDayEntryItem[]) => {
  return [...dayEntries].sort(
    (a, b) => new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
  )
}

export const getStatsForUser = (completedDayEntries: IDayEntryItem[]) => {
  const todaysDate = DateTime.now().toISODate()
  const sortedCompletedDayEntries = [...completedDayEntries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const datesPlayed = sortedCompletedDayEntries.map((entry) => entry.word.date)
  const currentStreak = getCurrentStreak(sortedCompletedDayEntries, todaysDate)
  const seasonAverages = getSeasonAverages(sortedCompletedDayEntries)

  const seasonAverageChanges = sortedCompletedDayEntries.reduce(
    (acc, entry) => {
      const entriesOnAndBefore = sortedCompletedDayEntries.filter(
        (e) =>
          DateTime.fromISO(e.word.date) <= DateTime.fromISO(entry.word.date)
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
    },
    {} as { [date: string]: number }
  )

  const stats = {
    maxStreak: getMaxStreak(sortedCompletedDayEntries, todaysDate),
    currentStreak,
    averageAttemptsCount: seasonAverages[seasonAverages.length - 1],
    winPercent: getWinPercent(sortedCompletedDayEntries),
    numberOfDaysPlayed: sortedCompletedDayEntries.length,
    lastPlayed: sortedCompletedDayEntries[0]?.createdAt,
    lastEntry: sortedCompletedDayEntries[0],
    guessDistribution: getGuessDistribution(sortedCompletedDayEntries),
    datesPlayed,
    seasonAverages,
    seasonAverageChanges,
  }

  return stats
}
