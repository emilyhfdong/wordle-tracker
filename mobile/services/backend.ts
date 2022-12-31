import axios from "axios"
import {
  TDayEntry,
  TGetFeedResponse,
  TGetFriendsResponse,
  TGetSeasonsResponse,
  TGetUserResponse,
  TTodaysWordResponse,
  TWrappedStatsResponse,
} from "./types"

const API_BASE = "https://v48qv8vkjg.execute-api.us-east-1.amazonaws.com/dev/"
// const API_BASE = "http://localhost:3000/dev/"

const getTodaysWord = async (): Promise<TTodaysWordResponse> => {
  const response = await axios.get("today", {
    baseURL: API_BASE,
  })
  console.log("DONE - geting today's word")

  return {
    word: response.data?.word,
    number: response.data?.number,
    date: response.data?.date,
  }
}

const createUser = async (name: string) => {
  const response = await axios.post<{ user: { id: string; name: string } }>(
    "users",
    { name },
    {
      baseURL: API_BASE,
    }
  )
  console.log("DONE - creating user")
  return response.data?.user
}

export const getUser = async (userId: string) => {
  const response = await axios.get<TGetUserResponse>(`users/${userId}`, {
    baseURL: API_BASE,
  })
  console.log("DONE - getting user")
  return response.data
}

const getWrappedStats = async (userId: string) => {
  const response = await axios.get<TWrappedStatsResponse>(
    `users/${userId}/wrapped`,
    {
      baseURL: API_BASE,
    }
  )
  console.log("DONE - getting user wrapped")
  return response.data
}

const getSeasons = async () => {
  const response = await axios.get<TGetSeasonsResponse>(`seasons`, {
    baseURL: API_BASE,
  })
  console.log("DONE - getting seasons")
  return response.data
}

const updateUserWithPushToken = async (userId: string, pushToken: string) => {
  const response = await axios.patch<{ user: { id: string; name: string } }>(
    `users/${userId}`,
    { pushToken },
    {
      baseURL: API_BASE,
    }
  )
  console.log("DONE - updating user")
  return response.data?.user
}

const createDayEntry = async (
  userId: string,
  { attemptsDetails, word }: TDayEntry
) => {
  const response = await axios.post(
    `users/${userId}/day-entry`,
    {
      attemptsDetails,
      word,
    },
    {
      baseURL: API_BASE,
    }
  )
  console.log("DONE - creating day entry")
  return response.data?.TDayEntry
}

const getFeed = async (userId: string) => {
  const response = await axios.get<TGetFeedResponse>(
    `users/${userId}/grouped-feed`,
    {
      baseURL: API_BASE,
    }
  )
  console.log("DONE - getting feed")
  return response.data
}

const getFriends = async (userId: string) => {
  const response = await axios.get<TGetFriendsResponse>(
    `users/${userId}/friends`,
    {
      baseURL: API_BASE,
    }
  )
  console.log("DONE - getting friends")
  return response.data
}

const addFriend = async (userId: string, friendId: string) => {
  const response = await axios.post(
    `users/${userId}/friends`,
    { friendId },
    {
      baseURL: API_BASE,
    }
  )
  console.log("DONE - adding friend")
  return response.data
}

const pingFriend = async (userId: string, friendId: string) => {
  const response = await axios.post(
    `users/${userId}/friends/${friendId}/ping`,
    {},
    {
      baseURL: API_BASE,
    }
  )
  console.log("DONE - pinging friend")
  return response.data
}

export const BackendService = {
  getTodaysWord,
  createUser,
  createDayEntry,
  getFeed,
  addFriend,
  updateUserWithPushToken,
  pingFriend,
  getUser,
  getFriends,
  getSeasons,
  getWrappedStats,
}
