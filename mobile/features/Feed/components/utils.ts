export const getScoreDisplay = ({
  attemptsCount,
  hasPlayedThisDay,
  isPartiallyCompleted,
}: {
  attemptsCount: number
  hasPlayedThisDay: boolean
  isPartiallyCompleted?: boolean
}) => {
  if (!hasPlayedThisDay) {
    return "? / 6"
  }
  return attemptsCount <= 6
    ? `${attemptsCount}${isPartiallyCompleted ? "+?" : ""} / 6`
    : "X / 6"
}
