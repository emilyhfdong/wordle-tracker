export const getMostCommonTimeOfDay = (
  hourOccuranceMap:
    | {
        [hour: string]: number
      }
    | undefined
) => {
  if (!hourOccuranceMap) {
    return ""
  }
  const timesOfDay = {
    "early morning": 0,
    morning: 0,
    afternoon: 0,
    night: 0,
  }

  for (let hour in hourOccuranceMap) {
    const occurance = hourOccuranceMap[hour]
    if (occurance < 6) {
      timesOfDay["early morning"] += occurance
    } else if (occurance < 12) {
      timesOfDay.morning += occurance
    } else if (occurance < 18) {
      timesOfDay.afternoon += occurance
    } else {
      timesOfDay.night += occurance
    }
  }

  return (Object.keys(timesOfDay) as (keyof typeof timesOfDay)[]).reduce(
    (acc, curr) => (timesOfDay[acc] > timesOfDay[curr] ? acc : curr),
    "early morning" as keyof typeof timesOfDay
  )
}
