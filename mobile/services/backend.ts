import axios from "axios"
import { API_BASE } from "@env"
import { IDayEntry } from "../redux/slices/day-entries.slice"

const getTodaysWord = async () => {
  const response = await axios.get("today", {
    baseURL: API_BASE,
  })
  console.log("get today's word response", response.data)
  return {
    word: response.data?.word,
    number: response.data?.number,
    date: response.data?.date,
  }
}

const createUser = async (name: string) => {
  const response = await axios.post<{ user: { id: string; name: string } }>(
    "user",
    { name },
    {
      baseURL: API_BASE,
    }
  )
  console.log("create user response", response.data)
  return response.data?.user
}

const createDayEntry = async (
  userId: string,
  { attemptsCount, attemptsDetails, date, number, word }: IDayEntry
) => {
  const response = await axios.post(
    `user/${userId}/day-entry`,
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
  console.log("creating day entry", response.data)
  return response.data?.dayEntry
}

export const BackendService = {
  getTodaysWord,
  createUser,
  createDayEntry,
}
