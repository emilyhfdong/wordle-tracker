import type { AWS } from "@serverless/typescript"

export const functions: AWS["functions"] = {
  scrapeWord: {
    handler: `src/functions/scrapeWord/handler.handler`,
    timeout: 900,
    events: [
      {
        schedule: {
          // everyday at 4:01am UTC (12:01 EST)
          rate: "cron(1 4 * * ? *)",
          enabled: true,
        },
      },
    ],
  },
  getTodaysWord: {
    handler: `src/functions/getTodaysWord/handler.handler`,
    events: [
      {
        http: { method: "GET", path: "today" },
      },
    ],
  },
  createUser: {
    handler: `src/functions/createUser/handler.handler`,
    events: [
      {
        http: { method: "POST", path: "/users" },
      },
    ],
  },
  updateUser: {
    handler: `src/functions/updateUser/handler.handler`,
    events: [
      {
        http: { method: "PATCH", path: "/users/{userId}" },
      },
    ],
  },
  createDayEntry: {
    handler: `src/functions/createDayEntry/handler.handler`,
    events: [
      {
        http: { method: "POST", path: "/users/{userId}/day-entry" },
      },
    ],
  },
  addFriend: {
    handler: `src/functions/addFriend/handler.handler`,
    events: [
      {
        http: { method: "POST", path: "/users/{userId}/friends" },
      },
    ],
  },
  pingFriend: {
    handler: `src/functions/pingFriend/handler.handler`,
    events: [
      {
        http: {
          method: "POST",
          path: "/users/{userId}/friends/{friendId}/ping",
        },
      },
    ],
  },
  getFeed: {
    handler: `src/functions/getFeed/handler.handler`,
    events: [
      {
        http: { method: "GET", path: "/users/{userId}/feed" },
      },
    ],
  },
  sendFriendNotifications: {
    handler: `src/functions/sendFriendNotifications/handler.handler`,
    events: [
      {
        stream: {
          type: "dynamodb",
          arn: { "Fn::GetAtt": ["WordzleTable", "StreamArn"] },
        },
      },
    ],
  },
}
