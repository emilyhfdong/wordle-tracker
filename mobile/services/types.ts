export type TPingStatus = "notifications_disabled" | "already_pinged" | "ready"

const GET_FEED_RESPONSE = {
  // EMILYTODO - remove this
  friends: [
    {
      currentStreak: 5,
      lastPlayed: "2022-03-29T04:42:30.542Z",
      name: "Emily",
      userId: "BNLGJ",
      averageAttemptsCount: 3.53,
      pingStatus: "already_pinged" as TPingStatus,
    },
  ],
  dayEntriesByDate: [
    {
      date: "2022-03-29",
      entries: [
        {
          userId: "BNLGJ",
          attemptsCount: 5,
          attemptsDetails: "CRANE TOAST DUALS PSALM SHALL",
          word: {
            date: "2022-03-29",
            answer: "SHALL",
            number: 283,
          },
          createdAt: "2022-03-29T04:42:30.542Z",
        },
        {
          userId: "YMLVN",
          attemptsCount: 5,
          attemptsDetails: "SOARE STAND SHAKY SHAWL SHALL",
          word: {
            date: "2022-03-29",
            answer: "SHALL",
            number: 283,
          },
          createdAt: "2022-03-29T04:29:42.542Z",
        },
      ],
    },
    {
      date: "2022-03-28",
      entries: [
        {
          userId: "BNLGJ",
          attemptsCount: 4,
          attemptsDetails: "CRANE DOWNY LOINS FOUND",
          word: {
            date: "2022-03-28",
            answer: "FOUND",
            number: 282,
          },
          createdAt: "2022-03-28T20:40:16.542Z",
        },
        {
          userId: "YMLVN",
          attemptsCount: 6,
          attemptsDetails: "SOARE TOPIC DOUGH WOUND BOUND FOUND",
          word: {
            date: "2022-03-28",
            answer: "FOUND",
            number: 282,
          },
          createdAt: "2022-03-28T20:32:30.542Z",
        },
      ],
    },
    {
      date: "2022-03-27",
      entries: [
        {
          userId: "BNLGJ",
          attemptsCount: 4,
          attemptsDetails: "CRANE NOISY NYLON NYMPH",
          word: {
            date: "2022-03-27",
            answer: "NYMPH",
            number: 281,
          },
          createdAt: "2022-03-27T14:46:58.542Z",
        },
        {
          userId: "YMLVN",
          attemptsCount: 4,
          attemptsDetails: "SOARE LIGHT HUNCH NYMPH",
          word: {
            date: "2022-03-27",
            answer: "NYMPH",
            number: 281,
          },
          createdAt: "2022-03-27T14:33:35.542Z",
        },
      ],
    },
    {
      date: "2022-03-26",
      entries: [
        {
          userId: "YMLVN",
          attemptsCount: 4,
          attemptsDetails: "SOARE DEPOT PEONY EPOXY",
          word: {
            date: "2022-03-26",
            answer: "EPOXY",
            number: 280,
          },
          createdAt: "2022-03-26T05:04:44.542Z",
        },
        {
          userId: "BNLGJ",
          attemptsCount: 4,
          attemptsDetails: "CRANE EMPTY ELOPE EPOXY",
          word: {
            date: "2022-03-26",
            answer: "EPOXY",
            number: 280,
          },
          createdAt: "2022-03-26T04:47:51.542Z",
        },
      ],
    },
    {
      date: "2022-03-25",
      entries: [
        {
          userId: "BNLGJ",
          attemptsCount: 4,
          attemptsDetails: "CRANE SHEET MERIT DEPOT",
          word: {
            date: "2022-03-25",
            answer: "DEPOT",
            number: 279,
          },
          createdAt: "2022-03-26T03:59:14.542Z",
        },
      ],
    },
  ],
}

export type TGetFeedResponse = typeof GET_FEED_RESPONSE
export type TDayEntry = TGetFeedResponse["dayEntriesByDate"][0]["entries"][0]

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
  },
}

export type TGetFriendsResponse = typeof GET_FRIENDS_RESPONSE
