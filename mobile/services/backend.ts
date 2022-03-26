import axios from "axios"
import { API_BASE } from "@env"
import { IDayEntry } from "../redux/slices/day-entries.slice"

const getTodaysWord = async () => {
  const response = await axios.get("today", {
    baseURL: API_BASE,
  })
  console.log("DONE - get today's word response")
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
  console.log("DONE - create user response")
  return response.data?.user
}

const createDayEntry = async (
  userId: string,
  { attemptsCount, attemptsDetails, date, number, word }: IDayEntry
) => {
  const response = await axios.post(
    `users/${userId}/day-entry`,
    {
      attemptsCount,
      attemptsDetails,
      date,
      word,
      number,
    },
    {
      baseURL: API_BASE,
    }
  )
  console.log("DONE - creating day entry")
  return response.data?.dayEntry
}

const getGroupedEntries = async (userId: string) => {
  const response = await axios.get(`users/${userId}/feed`, {
    baseURL: API_BASE,
  })
  console.log("DONE - feed response")
  return response.data
}

const getFriends = async (userId: string) => {
  const response = await axios.get<
    {
      id: string
      name: string
      lastEntryDate: string
      currentStreak: number
    }[]
  >(`users/${userId}/friends`, {
    baseURL: API_BASE,
  })
  console.log("DONE - feed response")
  return response.data
}

export const BackendService = {
  getTodaysWord,
  createUser,
  createDayEntry,
  getGroupedEntries,
  getFriends,
}
