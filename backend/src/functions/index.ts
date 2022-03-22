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
    timeout: 30,
    events: [
      {
        http: { method: "GET", path: "today", cors: true },
      },
    ],
  },
  healthCheck: {
    handler: `src/functions/healthCheck/handler.handler`,
    timeout: 30,
    events: [
      {
        http: { method: "GET", path: "/", cors: true },
      },
    ],
    vpc,
  },
  createUser: {
    handler: `src/functions/createUser/handler.handler`,
    timeout: 30,
    events: [
      {
        http: { method: "POST", path: "/user", cors: true },
      },
    ],
    vpc,
  },
  createDayEntry: {
    handler: `src/functions/createDayEntry/handler.handler`,
    timeout: 30,
    events: [
      {
        http: { method: "POST", path: "/user/{userId}/day-entry", cors: true },
      },
    ],
    vpc,
  },
}
