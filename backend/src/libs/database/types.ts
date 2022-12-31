type TUserId = string
type TFriendId = string
export interface IUserMetaDataItem {
  pk: TUserId
  sk: "metadata"
  name: string
  pushToken?: string
  friendIds: string[]
}

type TISODate = string

export interface IUserStatsItem {
  pk: TUserId
  sk: "stats"
  maxStreak: number
  currentStreak: number
  averageAttemptsCount: number
  winPercent: number
  numberOfDaysPlayed: number
  lastPlayed: string
  lastEntry: IDayEntryItem
  guessDistribution: { count: number; occurance: number }[]
  datesPlayed: string[]
  seasonAverages: number[]
  seasonAverageChanges: { [date: string]: number }
}

export interface IDayEntryItem {
  pk: TUserId
  sk: `day_entry#${TISODate}`
  word: {
    number: number
    answer: string
    date: TISODate
  }
  attemptsCount: number
  attemptsDetails: string
  createdAt: string
}

export interface IInitiatedPingItem {
  pk: TUserId
  sk: `initiated_ping#${TISODate}#${TFriendId}`
  createdAt: string
}

export interface IRecievedPingItem {
  pk: TUserId
  sk: `recieved_ping#${TISODate}#${TFriendId}`
  createdAt: string
}

type TSeasonNumber = string

export interface ISeasonItem {
  pk: "season"
  sk: TSeasonNumber
  leaderboard: { name: string; average: number }[]
  startDate: string
  endDate: string
}

export interface IWrappedStats {
  totalNumberOfGuesses: number
  top5Guesses: { guess: string; count: number }[]
  top5Letters: { guess: string; count: number }[]
  hourOccuranceMap: { [hour: number]: number }
  sameYellowPositionMistakes: IDayEntryItem[]
  existingWordMistake: IDayEntryItem[]
  socks: IDayEntryItem[]
  traps: IDayEntryItem[]
  initiatedPingFriendOccuranceMap: { [userId: string]: number }
  recievedPingFriendOccuranceMap: { [userId: string]: number }
  rankingByDay: number[]
  longestGreenStreak: number
  longestGreenStart: string
  longestRedStreak: number
  longestRedStart: string
}

export interface IWrappedStatsItem {
  pk: TUserId
  sk: `wrapped_stats#${TSeasonNumber}`
  stats: IWrappedStats
  startDate: string
  endDate: string
}
