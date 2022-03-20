import axios from "axios"

import { createContext, useEffect, useState } from "react"

export const WordContext = createContext<string>("")

export const WordContextProvider: React.FC = ({ children }) => {
  const [word, setWord] = useState("")
  useEffect(() => {
    const setAndSetWord = async () => {
      const response = await axios.get("today", {
        baseURL: process.env.REACT_APP_SERVICE_URL,
      })
      setWord(response.data.word)
    }
    setAndSetWord()
  }, [])
  return <WordContext.Provider value={word}>{children}</WordContext.Provider>
}
