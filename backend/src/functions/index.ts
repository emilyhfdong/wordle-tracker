import type { AWS } from "@serverless/typescript"

const vpc = {
  securityGroupIds: ["${self:custom.secrets.SECURITY_GROUP_ID}"],
  subnetIds: [
    "${self:custom.secrets.SUBNET1_ID}",
    "${self:custom.secrets.SUBNET2_ID}",
    "${self:custom.secrets.SUBNET3_ID}",
    "${self:custom.secrets.SUBNET4_ID}",
  ],
}

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
  healthCheck: {
    handler: `src/functions/healthCheck/handler.handler`,
    events: [
      {
        http: { method: "GET", path: "/" },
      },
    ],
    vpc,
  },
  createUser: {
    handler: `src/functions/createUser/handler.handler`,
    events: [
      {
        http: { method: "POST", path: "/users" },
      },
    ],
    vpc,
  },
  updateUser: {
    handler: `src/functions/updateUser/handler.handler`,
    events: [
      {
        http: { method: "PATCH", path: "/users/{userId}" },
      },
    ],
    vpc,
  },
  createDayEntry: {
    handler: `src/functions/createDayEntry/handler.handler`,
    events: [
      {
        http: { method: "POST", path: "/users/{userId}/day-entry" },
      },
    ],
    vpc,
  },
  addFriend: {
    handler: `src/functions/addFriend/handler.handler`,
    events: [
      {
        http: { method: "POST", path: "/users/{userId}/friends" },
      },
    ],
    vpc,
  },
  getFeed: {
    handler: `src/functions/getFeed/handler.handler`,
    events: [
      {
        http: { method: "GET", path: "/users/{userId}/feed" },
      },
    ],
    vpc,
  },
  getFriends: {
    handler: `src/functions/getFriends/handler.handler`,
    events: [
      {
        http: { method: "GET", path: "/users/{userId}/friends" },
      },
    ],
    vpc,
  },
}
