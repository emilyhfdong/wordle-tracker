import { database } from "@libs/database"
import {
  IDayEntryItem,
  IRecievedPingItem,
  ISeasonItem,
  IUserMetaDataItem,
  IUserStatsItem,
} from "@libs/database/types"
import { config } from "@libs/environment"
import { getAverageAttemptsForSeason } from "@libs/utils"
import { DateTime, Settings } from "luxon"
import fs from "fs"
import _userItems from "./userItems.json"
import _allWords from "./allWords.json"

type UserItems = {
  dayEntries: IDayEntryItem[]
  metadata: IUserMetaDataItem
  recievedPings: IRecievedPingItem[]
  initiatedPings: IRecievedPingItem[]
  stats: IUserStatsItem
}

const userItems = _userItems as UserItems[]
const allWords = _allWords as { [word: string]: string }

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

const getWrappedStats = (user: UserItems, rankingsByDay: string[][]) => {
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

  const top5Guesses: { guess: string; count: number }[] = [
    ...new Set(allGuesses),
  ]
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

  console.log("lo", averageChanges)

  let longestGreenStreak = 0
  let longestGreenStreakStart = 0
  let currentGreenStreak = 0
  let currentGreenStre

  for (let i = 0; i < averageChanges.length; i++) {
    if (averageChanges[i] <= 0) {
      currentGreenStreak += 1
      longestGreenStreak = Math.max(currentGreenStreak, longestGreenStreak)
    } else {
      currentGreenStreak = 0
    }
  }

  console.log("hii", longestGreenStreak)

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
  }
}

export const handler = async () => {
  // const users = await database.getAllUsers()

  // const userItems = await Promise.all(
  //   users.map((user) => database.getUserItems(user.pk))
  // )

  // fs.writeFileSync("userItems.json", JSON.stringify(userItems))

  const userIdToUsernameMap: { [userId: string]: string } = userItems.reduce(
    (acc, curr) => ({ ...acc, [curr.metadata.pk]: curr.metadata.name }),
    {}
  )

  console.log("hii map", userIdToUsernameMap)

  const firstDayOfSeason = DateTime.fromObject({
    year: 2023,
    month: 1,
    day: 1,
    hour: 4,
  })
    .minus({ day: 1 })
    .startOf("quarter")

  const lastDayOfSeason = firstDayOfSeason.endOf("quarter")
  const daysInSeason = Math.floor(
    lastDayOfSeason.diff(firstDayOfSeason).as("days")
  )

  const rankingsByDay = new Array(daysInSeason).fill(0).map((_, idx) => {
    return userItems
      .filter((user) => user.stats.seasonAverages[idx] !== null)
      .sort((a, b) => {
        const aAverage = a.stats.seasonAverages[idx]
        const bAverage = b.stats.seasonAverages[idx]
        return (
          (aAverage ||
            a.stats.seasonAverages[a.stats.seasonAverages.length - 1]) -
          (bAverage ||
            b.stats.seasonAverages[a.stats.seasonAverages.length - 1])
        )
      })
      .map((user) => user.metadata.pk)
  })

  // console.log(rankingsByDay)

  // userItems
  //   .filter((user) => !user.metadata.name.toLowerCase().includes("dev"))
  //   .forEach((user) => {
  //     console.log(
  //       user.metadata.name,
  //       getWrappedStats(user).initiatedPingFriendOccuranceMap
  //     )
  //   })

  const me = getWrappedStats(
    userItems.find((user) => user.metadata.pk === "MFFUE"),
    rankingsByDay
  )
  // console.log(me)

  return
}
