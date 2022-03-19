import * as env from "env-var"

export const config = {
  wordHistoryTableName: env
    .get("WORD_HISTORY_TABLE_NAME")
    .required()
    .asString(),
  timezone: env.get("TIMEZONE").required().asString(),
}
