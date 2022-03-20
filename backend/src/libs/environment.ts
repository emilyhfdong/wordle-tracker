import * as env from "env-var"

export const config = {
  wordHistoryTableName: env
    .get("WORD_HISTORY_TABLE_NAME")
    .required()
    .asString(),
  timezone: env.get("TIMEZONE").required().asString(),
  db: {
    name: env.get("UB_NAME").required().asString(),
    user: env.get("UB_USER").required().asString(),
    password: env.get("DB_PASSWORD").required().asString(),
    host: env.get("DB_HOST").required().asString(),
    port: env.get("DB_PORT").required().asInt(),
  },
}
