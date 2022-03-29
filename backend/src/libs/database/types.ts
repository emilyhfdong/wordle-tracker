type TUserId = string

export interface IUserMetaDataItem {
  pk: TUserId
  sk: "metadata"
  name: string
  pushToken?: string
  friendIds: string[]
}

type TISODate = string

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
