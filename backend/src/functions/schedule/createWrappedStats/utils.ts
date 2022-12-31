import {
  IDayEntryItem,
  IRecievedPingItem,
  IUserMetaDataItem,
  IUserStatsItem,
} from "@libs/database/types"
import { DateTime } from "luxon"

type UserItems = {
  dayEntries: IDayEntryItem[]
  metadata: IUserMetaDataItem
  recievedPings: IRecievedPingItem[]
  initiatedPings: IRecievedPingItem[]
  stats: IUserStatsItem
}

type TileColor = "grey" | "yellow" | "green"

interface Tile {
  letter: string
  color: TileColor
}

export const getTileColors = (guess: string, answer: string): Tile[] => {
  const tiles: Tile[] = new Array(5)
    .fill(null)
    .map((_, idx) => ({ letter: guess[idx] || "", color: "grey" }))

  return answer.split("").reduce((acc, answerLetter, idx) => {
    if (acc[idx].letter === answerLetter) {
      acc[idx].color = "green"
      return acc
    }
    const matchingYellow = acc.find(
      (tile) => tile.letter === answerLetter && tile.color !== "green"
    )
    if (matchingYellow) {
      matchingYellow.color = "yellow"
    }
    return acc
  }, tiles)
}

const getTileColorCounts = ({
  guess,
  answer,
}: {
  guess: string
  answer: string
}) => {
  const tiles = getTileColors(guess, answer)
  return {
    green: tiles.filter((tile) => tile.color === "green").length,
    yellow: tiles.filter((tile) => tile.color === "yellow").length,
    grey: tiles.filter((tile) => tile.color === "grey").length,
  }
}

export const getWrappedStats = ({
  user,
  rankingsByDay,
  allWords,
}: {
  user: UserItems
  rankingsByDay: string[][]
  allWords: { [word: string]: string }
}) => {
  const firstDayOfSeason = DateTime.fromObject({
    year: 2023,
    month: 1,
    day: 1,
    hour: 4,
  })
    .minus({ day: 1 })
    .startOf("quarter")

  const entries = user.dayEntries.filter((entry) =>
    DateTime.fromISO(entry.word.date).hasSame(firstDayOfSeason, "quarter")
  )

  const allGuesses = entries.reduce(
    (acc, curr) => [...acc, ...curr.attemptsDetails.split(" ")],
    [] as string[]
  )

  const guessOccuranceMap: { [guess: string]: number } = allGuesses.reduce(
    (acc, curr) => ({ ...acc, [curr]: (acc[curr] || 0) + 1 }),
    {}
  )

  const uniqueGuesses = [...new Set(allGuesses)]

  const top5Guesses: { guess: string; count: number }[] = uniqueGuesses
    .sort((a, b) => guessOccuranceMap[b] - guessOccuranceMap[a])
    .slice(0, 5)
    .reduce(
      (acc, curr) => [...acc, { guess: curr, count: guessOccuranceMap[curr] }],
      []
    )

  const allLetters = allGuesses.reduce(
    (acc, curr) => [...acc, ...curr.split("")],
    [] as string[]
  )

  const letterOccuranceMap: { [letter: string]: number } = allLetters.reduce(
    (acc, curr) => ({ ...acc, [curr]: (acc[curr] || 0) + 1 }),
    {}
  )

  const top5Letters: { guess: string; count: number }[] = [
    ...new Set(allLetters),
  ]
    .sort((a, b) => letterOccuranceMap[b] - letterOccuranceMap[a])
    .slice(0, 5)
    .reduce(
      (acc, curr) => [...acc, { guess: curr, count: letterOccuranceMap[curr] }],
      []
    )

  const allHours = entries.map(
    (entry) => DateTime.fromISO(entry.createdAt).hour
  )

  const hourOccuranceMap: { [hour: number]: number } = allHours.reduce(
    (acc, curr) => ({ ...acc, [curr]: (acc[curr] || 0) + 1 }),
    {}
  )

  const sameYellowPositionMistakes = entries.filter((entry) => {
    const correctAnswer = entry.word.answer
    const guesses = entry.attemptsDetails.split(" ")
    const yellowLetterPositions: { [letter: string]: number } = {}

    for (let i = 0; i < guesses.length; i++) {
      const guess = guesses[i]
      const tiles = getTileColors(guess, correctAnswer)
      for (let tilePosition = 0; tilePosition < tiles.length; tilePosition++) {
        const tile = tiles[tilePosition]
        if (tile.color === "yellow") {
          if (yellowLetterPositions[tile.letter] === tilePosition) {
            return true
          } else {
            yellowLetterPositions[tile.letter] = tilePosition
          }
        }
      }
    }
    return false
  })

  const existingWordMistake = entries
    .map((entry) => {
      const existingGuess = entry.attemptsDetails
        .split(" ")
        .find(
          (guess, index) =>
            index !== 0 &&
            allWords[guess] &&
            new Date(allWords[guess]) < new Date(entry.word.date)
        )
      return {
        ...entry,
        existingGuess: existingGuess
          ? { word: existingGuess, date: allWords[existingGuess] }
          : undefined,
      }
    })
    .filter((entry) => entry.existingGuess)

  const socks = entries.filter((entry) => entry.attemptsCount === 7)

  const traps = entries.filter((entry) => {
    const guesses = entry.attemptsDetails.split(" ")
    const answer = entry.word.answer

    if (guesses.length < 5) {
      return false
    }

    const initialTileColorCounts = getTileColorCounts({
      guess: guesses[0],
      answer,
    })
    let greenCount = initialTileColorCounts.green
    let trapCount = 0

    for (let i = 0; i < guesses.length; i++) {
      const tileColorCounts = getTileColorCounts({ guess: guesses[i], answer })
      if (
        greenCount === tileColorCounts.green &&
        tileColorCounts.yellow === 0 &&
        greenCount >= 3
      ) {
        trapCount += 1
      } else {
        trapCount = 1
      }
      greenCount = tileColorCounts.green

      if (trapCount === 2) {
        return true
      }
    }

    return false
  })

  const initiatedPings = user.initiatedPings.filter((ping) =>
    DateTime.fromISO(ping.createdAt).hasSame(firstDayOfSeason, "quarter")
  )

  const initiatedPingFriendOccuranceMap: { [userId: string]: number } =
    initiatedPings.reduce((acc, curr) => {
      const friendId = curr.sk.split("#")[2]
      return {
        ...acc,
        [friendId]: (acc[friendId] || 0) + 1,
      }
    }, {})

  const recievedPings = user.recievedPings.filter((ping) =>
    DateTime.fromISO(ping.createdAt).hasSame(firstDayOfSeason, "quarter")
  )

  const recievedPingFriendOccuranceMap: { [userId: string]: number } =
    recievedPings.reduce((acc, curr) => {
      const friendId = curr.sk.split("#")[2]
      return {
        ...acc,
        [friendId]: (acc[friendId] || 0) + 1,
      }
    }, {})

  const rankingByDay = rankingsByDay.map(
    (rankings) => rankings.indexOf(user.metadata.pk) + 1
  )

  const averageChanges = Object.keys(user.stats.seasonAverageChanges)
    .filter((date) =>
      DateTime.fromISO(date).hasSame(firstDayOfSeason, "quarter")
    )
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map((date) => user.stats.seasonAverageChanges[date])

  let longestGreenStreak = 0
  let longestGreenStart = firstDayOfSeason
  let currentGreenStreak = 0
  let currentGreenStart = firstDayOfSeason

  for (let i = 0; i < averageChanges.length; i++) {
    if (averageChanges[i] <= 0) {
      currentGreenStreak += 1
      if (longestGreenStreak < currentGreenStreak) {
        longestGreenStart = currentGreenStart
      }
      longestGreenStreak = Math.max(currentGreenStreak, longestGreenStreak)
    } else {
      currentGreenStreak = 0
      currentGreenStart = DateTime.fromISO(firstDayOfSeason.toISO()).plus({
        days: i + 1,
      })
    }
  }

  let longestRedStreak = 0
  let longestRedStart = firstDayOfSeason
  let currentRedStreak = 0
  let currentRedStart = firstDayOfSeason

  for (let i = 0; i < averageChanges.length; i++) {
    if (averageChanges[i] >= 0) {
      currentRedStreak += 1

      if (longestRedStreak < currentRedStreak) {
        longestRedStart = currentRedStart
      }
      longestRedStreak = Math.max(currentRedStreak, longestRedStreak)
    } else {
      currentRedStreak = 0
      currentRedStart = DateTime.fromISO(firstDayOfSeason.toISO()).plus({
        days: i + 1,
      })
    }
  }

  return {
    totalNumberOfGuesses: allGuesses.length,
    top5Guesses,
    top5Letters,
    hourOccuranceMap,
    sameYellowPositionMistakes,
    existingWordMistake,
    socks,
    traps,
    initiatedPingFriendOccuranceMap,
    recievedPingFriendOccuranceMap,
    rankingByDay,
    longestGreenStreak,
    longestGreenStart: longestGreenStart.toISODate(),
    longestRedStreak,
    longestRedStart: longestRedStart.toISODate(),
    uniqueGuessesCount: uniqueGuesses.length,
  }
}
