import { config } from "@libs/environment"
import AWS from "aws-sdk"
import { DateTime } from "luxon"
import {
  IDayEntryItem,
  IInitiatedPingItem,
  IRecievedPingItem,
  IUserMetaDataItem,
} from "./types"

const dynamodb = new AWS.DynamoDB.DocumentClient()

const getUser = async (id: string) => {
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
    }
  }
  return null
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

export const database = {
  getUser,
  putUser,
  getUserItems,
  createUserTDayEntry,
  createInitiatedPing,
  createRecievedPing,
}
