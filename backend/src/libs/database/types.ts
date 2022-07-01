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
