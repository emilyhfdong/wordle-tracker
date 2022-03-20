import axios from "axios"
import { API_BASE } from "@env"

import { createContext, useEffect, useState } from "react"

export const WordContext = createContext<string>("")

export const WordContextProvider: React.FC = ({ children }) => {
  const [word, setWord] = useState("")
  useEffect(() => {
    const setAndSetWord = async () => {
      const response = await axios.get("today", {
        baseURL: API_BASE,
      })
      setWord(response.data.word)
      console.log("hii", response.data)
    }
    setAndSetWord()
  }, [])
  return <WordContext.Provider value={word}>{children}</WordContext.Provider>
}
