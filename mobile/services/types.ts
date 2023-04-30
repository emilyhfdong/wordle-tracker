export type TPingStatus = "notifications_disabled" | "already_pinged" | "ready"

const GET_FEED_RESPONSE = {
  dayEntriesByDate: [
    {
      date: "2022-05-08",
      correctAnswer: "CANNY",
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
          isPartiallyCompleted: false,
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
  lastAverages: [4.4, 4.31],
  averageChanges: { ["2022-05-15" as string]: 0.03 },
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
    lastAverages: [4.4, 4.31],
    averageChanges: {
      "2022-06-08": -0.02,
      "2022-06-09": -0.01,
      "2022-06-10": 0,
      "2022-06-17": -0.01,
      "2022-06-18": -0.01,
      "2022-06-15": -0.02,
      "2022-06-16": -0.02,
    } as { [key: string]: number },
  },
}

export type TGetFriendsResponse = typeof GET_FRIENDS_RESPONSE
export type TFriend = TGetFriendsResponse["id"]

export const GET_SEASONS_RESPONSE = [
  {
    startDate: "2022-04-01",
    endDate: "2022-06-30",
    name: "Season 1",
    leaderboard: [
      {
        name: "Emily",
        average: 3.63,
        userId: "NPCAM",
      },
      {
        name: "Megan",
        average: 3.71,
        userId: "JYPTA",
      },
      {
        name: "JOY",
        average: 3.75,
        userId: "CZVST",
      },
      {
        name: "Zach",
        average: 3.83,
        userId: "CMRAH",
      },
      {
        name: "Jerm ",
        average: 4.04,
        userId: "QTBNK",
      },
      {
        name: "jonas",
        average: 4.07,
        userId: "FKRNV",
      },
      {
        name: "katy",
        average: 4.23,
        userId: "MFFUE",
      },
      {
        name: "cindy",
        average: 4.4,
        userId: "BHNOF",
      },
      {
        name: "Cutter",
        average: 5.66,
        userId: "SJMKR",
      },
      {
        name: "Dunc",
        average: 6.55,
        userId: "JRVIW",
      },
    ],
  },
]

export type TGetSeasonsResponse = typeof GET_SEASONS_RESPONSE

export type TTodaysWordResponse = {
  word: string | null
  number: number | null
  date: string
}

export const GET_USER_WRAPPED_RESPONSE = {
  stats: {
    hourOccuranceMap: {
      "8": 1,
      "9": 8,
      "10": 8,
      "11": 21,
      "12": 15,
      "13": 9,
      "14": 6,
      "15": 1,
      "16": 2,
      "17": 4,
      "19": 3,
      "21": 3,
      "22": 3,
      "23": 1,
    } as { [hour: string]: number },
    sameYellowPositionMistakes: [
      {
        sk: "day_entry#2022-10-15",
        attemptsDetails: "AUDIO SLATE PARTY MATCH BATCH WATCH",
        createdAt: "2022-10-15T21:47:14.332Z",
        attemptsCount: 7,
        pk: "MFFUE",
        word: {
          date: "2022-10-15",
          answer: "CATCH",
          number: 483,
        },
      },
      {
        sk: "day_entry#2022-11-01",
        attemptsDetails: "AUDIO CRIME SKEIN INEPT PINEY",
        createdAt: "2022-11-01T17:08:05.607Z",
        attemptsCount: 5,
        pk: "MFFUE",
        word: {
          date: "2022-11-01",
          answer: "PINEY",
          number: 500,
        },
      },
      {
        sk: "day_entry#2022-11-09",
        attemptsDetails: "AUDIO SEPIA TAINT RAINY",
        createdAt: "2022-11-09T17:07:14.899Z",
        attemptsCount: 4,
        pk: "MFFUE",
        word: {
          date: "2022-11-09",
          answer: "RAINY",
          number: 508,
        },
      },
      {
        sk: "day_entry#2022-11-12",
        attemptsDetails: "AUDIO PLEAT LEAST EXALT VALET",
        createdAt: "2022-11-13T00:48:28.206Z",
        attemptsCount: 5,
        pk: "MFFUE",
        word: {
          date: "2022-11-12",
          answer: "VALET",
          number: 511,
        },
      },
    ],
    totalNumberOfGuesses: 347,
    longestGreenStart: "2022-11-02",
    longestRedStart: "2022-12-18",
    existingWordMistake: [
      {
        createdAt: "2022-10-03T12:38:43.272Z",
        attemptsCount: 4,
        existingGuess: {
          date: "2022-09-18",
          word: "STICK",
        },
        sk: "day_entry#2022-10-03",
        attemptsDetails: "AUDIO SPIRE STICK STING",
        pk: "MFFUE",
        word: {
          date: "2022-10-03",
          answer: "STING",
          number: 471,
        },
      },
      {
        createdAt: "2022-10-05T20:10:24.060Z",
        attemptsCount: 5,
        existingGuess: {
          date: "2022-06-01",
          word: "CREAK",
        },
        sk: "day_entry#2022-10-05",
        attemptsDetails: "AUDIO CREAK PARTY WARNS MARSH",
        pk: "MFFUE",
        word: {
          date: "2022-10-05",
          answer: "MARSH",
          number: 473,
        },
      },
      {
        createdAt: "2022-10-08T17:04:21.856Z",
        attemptsCount: 3,
        existingGuess: {
          date: "2022-07-08",
          word: "VOICE",
        },
        sk: "day_entry#2022-10-08",
        attemptsDetails: "AUDIO VOICE VIGOR",
        pk: "MFFUE",
        word: {
          date: "2022-10-08",
          answer: "VIGOR",
          number: 476,
        },
      },
      {
        createdAt: "2022-10-17T15:17:27.229Z",
        attemptsCount: 3,
        existingGuess: {
          date: "2022-03-21",
          word: "THEIR",
        },
        sk: "day_entry#2022-10-17",
        attemptsDetails: "AUDIO THEIR STEIN",
        pk: "MFFUE",
        word: {
          date: "2022-10-17",
          answer: "STEIN",
          number: 485,
        },
      },
      {
        createdAt: "2022-10-25T16:13:20.824Z",
        attemptsCount: 4,
        existingGuess: {
          date: "2022-09-27",
          word: "SOGGY",
        },
        sk: "day_entry#2022-10-25",
        attemptsDetails: "AUDIO TROVE SOGGY FOGGY",
        pk: "MFFUE",
        word: {
          date: "2022-10-25",
          answer: "FOGGY",
          number: 493,
        },
      },
      {
        createdAt: "2022-10-30T23:02:25.989Z",
        attemptsCount: 4,
        existingGuess: {
          date: "2022-06-01",
          word: "CREAK",
        },
        sk: "day_entry#2022-10-30",
        attemptsDetails: "AUDIO CREAK TWANG WALTZ",
        pk: "MFFUE",
        word: {
          date: "2022-10-30",
          answer: "WALTZ",
          number: 498,
        },
      },
      {
        createdAt: "2022-11-22T18:22:22.817Z",
        attemptsCount: 4,
        existingGuess: {
          date: "2022-05-23",
          word: "HINGE",
        },
        sk: "day_entry#2022-11-22",
        attemptsDetails: "AUDIO HINGE SWIPE PRIME",
        pk: "MFFUE",
        word: {
          date: "2022-11-22",
          answer: "PRIME",
          number: 521,
        },
      },
      {
        createdAt: "2022-11-28T04:26:20.647Z",
        attemptsCount: 4,
        existingGuess: {
          date: "2022-05-21",
          word: "SCRAP",
        },
        sk: "day_entry#2022-11-27",
        attemptsDetails: "AUDIO PLATE SCRAP HAPPY",
        pk: "MFFUE",
        word: {
          date: "2022-11-27",
          answer: "HAPPY",
          number: 526,
        },
      },
      {
        createdAt: "2022-12-10T22:23:18.817Z",
        attemptsCount: 5,
        existingGuess: {
          date: "2022-07-18",
          word: "FLOCK",
        },
        sk: "day_entry#2022-12-10",
        attemptsDetails: "AUDIO SPOKE BROCK FLOCK KNOCK",
        pk: "MFFUE",
        word: {
          date: "2022-12-10",
          answer: "KNOCK",
          number: 539,
        },
      },
      {
        createdAt: "2022-12-14T14:44:13.393Z",
        attemptsCount: 4,
        existingGuess: {
          date: "2022-10-13",
          word: "EQUAL",
        },
        sk: "day_entry#2022-12-14",
        attemptsDetails: "AUDIO HAUNT EQUAL USUAL",
        pk: "MFFUE",
        word: {
          date: "2022-12-14",
          answer: "USUAL",
          number: 543,
        },
      },
    ],
    socks: [
      {
        sk: "day_entry#2022-10-15",
        attemptsDetails: "AUDIO SLATE PARTY MATCH BATCH WATCH",
        createdAt: "2022-10-15T21:47:14.332Z",
        attemptsCount: 7,
        pk: "MFFUE",
        word: {
          date: "2022-10-15",
          answer: "CATCH",
          number: 483,
        },
      },
    ],
    top5Guesses: [
      {
        count: 83,
        guess: "AUDIO",
      },
      {
        count: 5,
        guess: "CRIME",
      },
      {
        count: 5,
        guess: "SLATE",
      },
      {
        count: 4,
        guess: "PLATE",
      },
      {
        count: 3,
        guess: "HAUNT",
      },
    ],
    initiatedPingFriendOccuranceMap: {
      NPCAM: 1,
      CZVST: 2,
    } as { [friendId: string]: number },
    traps: [
      {
        sk: "day_entry#2022-10-04",
        attemptsDetails: "AUDIO FLOUR COUGH SOUGH TOUGH BOUGH",
        createdAt: "2022-10-04T13:02:04.793Z",
        attemptsCount: 6,
        pk: "MFFUE",
        word: {
          date: "2022-10-04",
          answer: "BOUGH",
          number: 472,
        },
      },
      {
        sk: "day_entry#2022-10-15",
        attemptsDetails: "AUDIO SLATE PARTY MATCH BATCH WATCH",
        createdAt: "2022-10-15T21:47:14.332Z",
        attemptsCount: 7,
        pk: "MFFUE",
        word: {
          date: "2022-10-15",
          answer: "CATCH",
          number: 483,
        },
      },
      {
        sk: "day_entry#2022-10-26",
        attemptsDetails: "AUDIO SHOUT GROUT CLOUT FLOUT",
        createdAt: "2022-10-26T15:31:51.468Z",
        attemptsCount: 5,
        pk: "MFFUE",
        word: {
          date: "2022-10-26",
          answer: "FLOUT",
          number: 494,
        },
      },
      {
        sk: "day_entry#2022-11-15",
        attemptsDetails: "AUDIO STEAM SCARY SHARP SNARL",
        createdAt: "2022-11-15T16:14:43.059Z",
        attemptsCount: 5,
        pk: "MFFUE",
        word: {
          date: "2022-11-15",
          answer: "SNARL",
          number: 514,
        },
      },
      {
        sk: "day_entry#2022-11-24",
        attemptsDetails: "AUDIO PLATE HEART YEAST BEAST FEAST",
        createdAt: "2022-11-24T21:42:23.926Z",
        attemptsCount: 6,
        pk: "MFFUE",
        word: {
          date: "2022-11-24",
          answer: "FEAST",
          number: 523,
        },
      },
      {
        sk: "day_entry#2022-12-05",
        attemptsDetails: "AUDIO SPOKE JOKER HOKEY TOKEN WOKEN",
        createdAt: "2022-12-05T16:36:37.931Z",
        attemptsCount: 6,
        pk: "MFFUE",
        word: {
          date: "2022-12-05",
          answer: "WOKEN",
          number: 534,
        },
      },
      {
        sk: "day_entry#2022-12-10",
        attemptsDetails: "AUDIO SPOKE BROCK FLOCK KNOCK",
        createdAt: "2022-12-10T22:23:18.817Z",
        attemptsCount: 5,
        pk: "MFFUE",
        word: {
          date: "2022-12-10",
          answer: "KNOCK",
          number: 539,
        },
      },
      {
        sk: "day_entry#2022-12-13",
        attemptsDetails: "AUDIO CLOSE SHOVE STORE SMOKE SPOKE",
        createdAt: "2022-12-13T14:59:20.161Z",
        attemptsCount: 6,
        pk: "MFFUE",
        word: {
          date: "2022-12-13",
          answer: "SPOKE",
          number: 542,
        },
      },
      {
        sk: "day_entry#2022-12-16",
        attemptsDetails: "AUDIO STORE PRONE PROVE PROBE",
        createdAt: "2022-12-16T14:39:36.955Z",
        attemptsCount: 5,
        pk: "MFFUE",
        word: {
          date: "2022-12-16",
          answer: "PROBE",
          number: 545,
        },
      },
    ],
    longestRedStreak: 6,
    longestGreenStreak: 10,
    recievedPingFriendOccuranceMap: {
      NPCAM: 4,
      JYPTA: 11,
      CZVST: 1,
    } as { [key: string]: number },
    rankingByDay: [
      7, 10, 9, 9, 9, 10, 9, 9, 9, 9, 6, 6, 6, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9,
      9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10,
      10, 10, 9, 9, 10, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
      10, 10, 10, 10, 10, 10, 10,
    ],
    top5Letters: [
      {
        count: 209,
        guess: "A",
      },
      {
        count: 177,
        guess: "E",
      },
      {
        count: 161,
        guess: "I",
      },
      {
        count: 157,
        guess: "O",
      },
      {
        count: 126,
        guess: "U",
      },
    ],
    uniqueGuessesCount: 500,
  },
  sk: "wrapped_stats#2",
  pk: "MFFUE",
}

export type TWrappedStatsResponse = typeof GET_USER_WRAPPED_RESPONSE
