import { config } from "@libs/environment"
import AWS from "aws-sdk"
import { DateTime } from "luxon"
import {
  IDayEntryItem,
  IInitiatedPingItem,
  IRecievedPingItem,
  ISeasonItem,
  IUserMetaDataItem,
  IUserStatsItem,
} from "./types"

const dynamodb = new AWS.DynamoDB.DocumentClient()

const getSeasons = async () => {
  const pk: ISeasonItem["pk"] = "season"
  const response = await dynamodb
    .query({
      TableName: config.dynamoTableName,
      KeyConditionExpression: `pk = :pk`,
      ExpressionAttributeValues: {
        ":pk": pk,
      },
    })
    .promise()

  if (response.Items) {
    return response.Items as ISeasonItem[]
  }
  return null
}

const putSeason = async (
  leaderboard: ISeasonItem["leaderboard"],
  startDate: string,
  endDate: string,
  seasonNumber: string
) => {
  const item: ISeasonItem = {
    pk: "season",
    sk: seasonNumber,
    leaderboard,
    startDate,
    endDate,
  }

  await dynamodb
    .put({
      TableName: config.dynamoTableName,
      Item: item,
    })
    .promise()

  return item
}

const getUserMetadata = async (id: string) => {
  const pk: IUserMetaDataItem["pk"] = id
  const sk: IUserMetaDataItem["sk"] = "metadata"
  const response = await dynamodb
    .get({
      TableName: config.dynamoTableName,
      Key: {
        pk,
        sk,
      },
    })
    .promise()

  if (response.Item) {
    return response.Item as IUserMetaDataItem
  }
  return null
}

const getUserStats = async (id: string) => {
  const pk: IUserStatsItem["pk"] = id
  const sk: IUserStatsItem["sk"] = "stats"
  const response = await dynamodb
    .get({
      TableName: config.dynamoTableName,
      Key: {
        pk,
        sk,
      },
    })
    .promise()

  if (response.Item) {
    return response.Item as IUserStatsItem
  }
  return null
}

const getAllUsers = async () => {
  const response = await dynamodb
    .scan({
      TableName: config.dynamoTableName,
      FilterExpression: "sk = :sk",
      ExpressionAttributeValues: {
        ":sk": "metadata",
      },
    })
    .promise()
  if (response.Items) {
    return (response.Items as IUserMetaDataItem[]).filter(
      (user) =>
        !user.name.toLowerCase().includes("dev") && user.friendIds.length
    )
  }
  return null
}

const putUser = async (
  id: string,
  userFields: Omit<IUserMetaDataItem, "sk" | "pk">
) => {
  const item: IUserMetaDataItem = {
    pk: id,
    sk: "metadata",
    ...userFields,
  }

  await dynamodb
    .put({
      TableName: config.dynamoTableName,
      Item: item,
    })
    .promise()

  return item
}

const putUserStats = async (
  id: string,
  stats: Omit<IUserStatsItem, "sk" | "pk">
) => {
  const item: IUserStatsItem = {
    pk: id,
    sk: "stats",
    ...stats,
  }

  await dynamodb
    .put({
      TableName: config.dynamoTableName,
      Item: item,
    })
    .promise()

  return item
}

const getUserItems = async (userId: string) => {
  const pk: IDayEntryItem["pk"] = userId
  const response = await dynamodb
    .query({
      TableName: config.dynamoTableName,
      KeyConditionExpression: `pk = :pk`,
      ExpressionAttributeValues: {
        ":pk": pk,
      },
    })
    .promise()
  if (response.Items) {
    return {
      dayEntries: response.Items.filter((item): item is IDayEntryItem =>
        item.sk.includes("day_entry")
      ),
      metadata: response.Items.find(
        (item): item is IUserMetaDataItem => item.sk === "metadata"
      ),
      recievedPings: response.Items.filter((item): item is IRecievedPingItem =>
        item.sk.includes("recieved_ping")
      ),
      initiatedPings: response.Items.filter((item): item is IRecievedPingItem =>
        item.sk.includes("initiated_ping")
      ),
      stats: response.Items.find(
        (item): item is IUserStatsItem => item.sk === "stats"
      ),
    }
  }
  return null
}

const getUserDayEntries = async (userId: string, datePrefix?: string) => {
  const response = await dynamodb
    .query({
      TableName: config.dynamoTableName,
      KeyConditionExpression: `pk = :pk and begins_with(sk, :skPrefix)`,
      ExpressionAttributeValues: {
        ":pk": userId,
        ":skPrefix": datePrefix ? `day_entry#${datePrefix}` : "day_entry",
      },
    })
    .promise()

  if (response.Items) {
    return response.Items as IDayEntryItem[]
  }
  return []
}

const getInitiatedPings = async (userId: string, date: string) => {
  const response = await dynamodb
    .query({
      TableName: config.dynamoTableName,
      KeyConditionExpression: `pk = :pk and begins_with(sk, :skPrefix)`,
      ExpressionAttributeValues: {
        ":pk": userId,
        ":skPrefix": `initiated_ping#${date}`,
      },
    })
    .promise()

  if (response.Items) {
    return response.Items as IInitiatedPingItem[]
  }
  return []
}

const getUserMetadataStats = async (userId: string) => {
  const [metadata, stats] = await Promise.all([
    getUserMetadata(userId),
    getUserStats(userId),
  ])

  return { metadata, stats }
}

const getUserMetadataStatsPings = async (userId: string, date: string) => {
  const [metadata, stats, initiatedPings] = await Promise.all([
    getUserMetadata(userId),
    getUserStats(userId),
    getInitiatedPings(userId, date),
  ])

  return { metadata, stats, initiatedPings }
}

const createInitiatedPing = async (
  userId: string,
  friendId: string,
  pingDate: string
) => {
  const item: IInitiatedPingItem = {
    pk: userId,
    sk: `initiated_ping#${pingDate}#${friendId}`,
    createdAt: DateTime.now().toUTC().toISO(),
  }

  await dynamodb
    .put({
      TableName: config.dynamoTableName,
      Item: item,
    })
    .promise()

  return item
}

const createRecievedPing = async (
  userId: string,
  friendId: string,
  pingDate: string
) => {
  const item: IRecievedPingItem = {
    pk: userId,
    sk: `recieved_ping#${pingDate}#${friendId}`,
    createdAt: DateTime.now().toUTC().toISO(),
  }

  await dynamodb
    .put({
      TableName: config.dynamoTableName,
      Item: item,
    })
    .promise()

  return item
}

const createUserTDayEntry = async (
  userId: string,
  fields: Omit<IDayEntryItem, "pk" | "sk">
) => {
  const item: IDayEntryItem = {
    pk: userId,
    sk: `day_entry#${fields.word.date}`,
    ...fields,
  }

  await dynamodb
    .put({
      TableName: config.dynamoTableName,
      Item: item,
    })
    .promise()

  return item
}

const getAllWords = async (): Promise<{ [word: string]: string }> => {
  const allWords = await dynamodb
    .scan({
      TableName: config.wordHistoryTableName,
    })
    .promise()

  return allWords.Items.reduce(
    (acc, curr) => ({ ...acc, [curr.word]: curr.date }),
    {}
  )
}

export const database = {
  getUser: getUserMetadata,
  putUser,
  getUserItems,
  createUserTDayEntry,
  createInitiatedPing,
  createRecievedPing,
  getAllUsers,
  putSeason,
  getSeasons,
  putUserStats,
  getUserMetadataStats,
  getInitiatedPings,
  getUserMetadataStatsPings,
  getUserDayEntries,
  getUserMetadata,
  getAllWords,
}
