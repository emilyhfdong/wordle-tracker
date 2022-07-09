import type { AWS } from "@serverless/typescript"

export const functions: AWS["functions"] = {
  scrapeWord: {
    handler: `src/functions/schedule/scrapeWord/handler.handler`,
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
    handler: `src/functions/api/getTodaysWord/handler.handler`,
    events: [
      {
        http: { method: "GET", path: "today" },
      },
    ],
  },
  createUser: {
    handler: `src/functions/api/createUser/handler.handler`,
    events: [
      {
        http: { method: "POST", path: "/users" },
      },
    ],
  },
  updateUser: {
    handler: `src/functions/api/updateUser/handler.handler`,
    events: [
      {
        http: { method: "PATCH", path: "/users/{userId}" },
      },
    ],
  },
  getUser: {
    handler: `src/functions/api/getUser/handler.handler`,
    timeout: 10,
    events: [
      {
        http: { method: "GET", path: "/users/{userId}" },
      },
    ],
  },
  createDayEntry: {
    handler: `src/functions/api/createDayEntry/handler.handler`,
    events: [
      {
        http: { method: "POST", path: "/users/{userId}/day-entry" },
      },
    ],
  },
  addFriend: {
    handler: `src/functions/api/addFriend/handler.handler`,
    events: [
      {
        http: { method: "POST", path: "/users/{userId}/friends" },
      },
    ],
  },
  getFriendsList: {
    handler: `src/functions/api/getFriendsList/handler.handler`,
    timeout: 10,
    events: [
      {
        http: { method: "GET", path: "/users/{userId}/friends" },
      },
    ],
  },
  pingFriend: {
    handler: `src/functions/api/pingFriend/handler.handler`,
    events: [
      {
        http: {
          method: "POST",
          path: "/users/{userId}/friends/{friendId}/ping",
        },
      },
    ],
  },
  getGroupedFeed: {
    handler: `src/functions/api/getGroupedFeed/handler.handler`,
    events: [
      {
        http: { method: "GET", path: "/users/{userId}/grouped-feed" },
      },
    ],
  },
  getSeasons: {
    handler: `src/functions/api/getSeasons/handler.handler`,
    events: [
      {
        http: { method: "GET", path: "/seasons" },
      },
    ],
  },
  sendFriendNotifications: {
    handler: `src/functions/dynamoStream/sendFriendNotifications/handler.handler`,
    events: [
      {
        stream: {
          type: "dynamodb",
          arn: { "Fn::GetAtt": ["WordzleTable", "StreamArn"] },
        },
      },
    ],
  },
  updateStats: {
    handler: `src/functions/dynamoStream/updateStats/handler.handler`,
    events: [
      {
        stream: {
          type: "dynamodb",
          arn: { "Fn::GetAtt": ["WordzleTable", "StreamArn"] },
        },
      },
    ],
  },
  createSeasonStats: {
    handler: `src/functions/schedule/createSeasonStats/handler.handler`,
    events: [
      {
        schedule: {
          // every 3 months on the 1st at 4:01am UTC (12:01am EST)
          rate: "cron(1 4 1 1/3 ? *)",
          enabled: true,
        },
      },
    ],
  },
  sendSeasonEndNotifications: {
    handler: `src/functions/schedule/sendSeasonEndNotifications/handler.handler`,
    events: [
      {
        schedule: {
          // every 3 months on the 1st at 4:01pm UTC (12:01pm EST)
          rate: "cron(1 16 1 1/3 ? *)",
          enabled: true,
        },
      },
    ],
  },

  backfillStats: {
    handler: `src/functions/backfill/backfillStats/handler.handler`,
  },
}
