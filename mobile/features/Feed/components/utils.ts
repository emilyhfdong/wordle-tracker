export const getScoreDisplay = ({
  attemptsCount,
  hasPlayedThisDay,
}: {
  attemptsCount: number
  hasPlayedThisDay: boolean
}) => {
  if (!hasPlayedThisDay) {
    return "? / 6"
  }
  return attemptsCount <= 6 ? `${attemptsCount} / 6` : "X / 6"
}
