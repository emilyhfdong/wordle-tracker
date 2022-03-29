import axios from "axios"
import { API_BASE } from "@env"
import { IDayEntry } from "../redux/slices/day-entries.slice"
import { TGetFeedResponse } from "./types"

const getTodaysWord = async () => {
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
  { attemptsDetails, word }: IDayEntry
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
  return response.data?.dayEntry
}

const getFeed = async (userId: string) => {
  const response = await axios.get<TGetFeedResponse>(`users/${userId}/feed`, {
    baseURL: API_BASE,
  })
  console.log("DONE - getting feed")
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

export const BackendService = {
  getTodaysWord,
  createUser,
  createDayEntry,
  getFeed,
  addFriend,
  updateUserWithPushToken,
}
