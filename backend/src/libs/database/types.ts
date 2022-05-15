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
