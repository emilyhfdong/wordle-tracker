import { config } from "@libs/environment"
import AWS from "aws-sdk"
import { IDayEntryItem, IUserMetaDataItem } from "./types"

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
      dayEntries: response.Items.filter(
        (item): item is IDayEntryItem => item.sk !== "metadata"
      ),
      metadata: response.Items.find(
        (item): item is IUserMetaDataItem => item.sk === "metadata"
      ),
    }
  }
  return null
}

const createUserDayEntry = async (
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
  createUserDayEntry,
}
