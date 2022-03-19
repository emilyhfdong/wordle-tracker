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
  getBooks: {
    handler: `src/functions/getTodaysWord/handler.handler`,
    timeout: 30,
    events: [
      {
        http: { method: "GET", path: "today", cors: true },
      },
    ],
  },
}
