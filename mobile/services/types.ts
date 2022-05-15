export type TPingStatus = "notifications_disabled" | "already_pinged" | "ready"

const GET_FEED_RESPONSE = {
  dayEntriesByDate: [
    {
      date: "2022-05-08",
      entries: [
        {
          userId: "FKRNV",
          attemptsCount: 4,
          attemptsDetails: "ACORN SNACK CANDY CANNY",
          word: {
            date: "2022-05-08",
            answer: "CANNY",
            number: 323,
          },
          createdAt: "2022-05-08T11:57:23.753Z",
        },
      ],
      avgAttemptsCount: 3.67,
    },
  ],
}

export type TGetFeedResponse = typeof GET_FEED_RESPONSE
export type TGroupedDayEntries = TGetFeedResponse["dayEntriesByDate"][0]
export type TDayEntry = TGroupedDayEntries["entries"][0]

export const GET_USER_RESPONSE = {
  userId: "NPCAM",
  name: "Emily",
  maxStreak: 15,
  currentStreak: 15,
  averageAttemptsCount: 3.4,
  winPercent: 100,
  numberOfDaysPlayed: 15,
  lastPlayed: "2022-04-15T15:55:30.478Z",
  datesPlayed: ["2022-04-15", "2022-04-14"],
  averageChange: 0.03,
  lastEntry: {
    attemptsCount: 3,
    createdAt: "2022-04-15T15:55:30.478Z",
    sk: "day_entry#2022-04-15",
    pk: "NPCAM",
    attemptsDetails: "CRANE SLATE SHAME",
    word: {
      date: "2022-04-15",
      answer: "SHAME",
      number: 300,
    },
  },
  guessDistribution: [
    {
      count: 1,
      occurance: 0,
    },
    {
      count: 2,
      occurance: 3,
    },
    {
      count: 3,
      occurance: 5,
    },
    {
      count: 4,
      occurance: 5,
    },
    {
      count: 5,
      occurance: 2,
    },
    {
      count: 6,
      occurance: 0,
    },
  ],
  last30Averages: [4.4, 4.31],
}

export type TGetUserResponse = typeof GET_USER_RESPONSE

export const GET_FRIENDS_RESPONSE = {
  ["MFFUE" as string]: {
    currentStreak: 5,
    lastPlayed: "2022-04-15T04:17:49.882Z",
    averageAttemptsCount: 4.43,
    name: "katy",
    userId: "MFFUE",
    pingStatus: "ready" as TPingStatus,
    color: "#78CFA0",
    averageChange: 0.03,
    last30Averages: [4.4, 4.31],
  },
}

export type TGetFriendsResponse = typeof GET_FRIENDS_RESPONSE
