import axios from "axios"
import { API_BASE } from "@env"

const getTodaysWord = async () => {
  const response = await axios.get("today", {
    baseURL: API_BASE,
  })
  console.log("get today's word response", response.data)
  return response.data?.word
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

export const BackendService = {
  getTodaysWord,
  createUser,
}
