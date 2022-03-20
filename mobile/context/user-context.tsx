import axios from "axios"
import { API_BASE } from "@env"

import { createContext, useEffect, useState } from "react"

export const UserContext = createContext<string>("")

export const UserContextProvider: React.FC = ({ children }) => {
  const [word, setWord] = useState("")
  useEffect(() => {
    const setAndSetWord = async () => {
      const response = await axios.get("today", {
        baseURL: API_BASE,
      })
      setWord(response.data.word)
    }
    setAndSetWord()
  }, [])
  return <UserContext.Provider value={word}>{children}</UserContext.Provider>
}
