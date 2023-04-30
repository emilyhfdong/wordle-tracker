import { IDayEntryItem } from "@libs/database/types"

interface IDateGroup {
  date: string
  correctAnswer: string
  entries: {
    userId: string
    attemptsCount: number
    attemptsDetails: string
    word: IDayEntryItem["word"]
    createdAt: string
    isPartiallyCompleted?: boolean
  }[]
  avgAttemptsCount: number
}

export const getGroupedDayEntries = (
  dayEntries: IDayEntryItem[]
): IDateGroup[] => {
  const groupedEntries = dayEntries.reduce(
    (
      acc,
      {
        pk: userId,
        attemptsCount,
        attemptsDetails,
        word,
        createdAt,
        isPartiallyCompleted,
        updatedAt,
      }
    ) => {
      const newEntry: IDateGroup["entries"][0] = {
        userId,
        attemptsCount,
        attemptsDetails,
        word,
        createdAt: updatedAt || createdAt,
        isPartiallyCompleted,
      }

      const existingGroup = acc.find((group) => group.date === word.date)
      if (existingGroup) {
        return acc.map((group) =>
          group.date !== word.date
            ? group
            : { date: word.date, entries: [...group.entries, newEntry] }
        )
      }
      return [...acc, { date: word.date, entries: [newEntry] }]
    },
    [] as Omit<IDateGroup, "avgAttemptsCount">[]
  )
  return groupedEntries.map((group) => ({
    ...group,
    correctAnswer: group.entries[0].word.answer,
    avgAttemptsCount: group.entries.length
      ? Number(
          (
            group.entries.reduce((acc, curr) => acc + curr.attemptsCount, 0) /
            group.entries.length
          ).toFixed(2)
        )
      : 0,
  }))
}
