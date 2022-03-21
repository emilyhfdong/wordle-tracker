import { createContext, useEffect, useState } from "react"
import { BackendService } from "../services/backend"

export const WordContext = createContext<string>("")

export const WordContextProvider: React.FC = ({ children }) => {
  const [word, setWord] = useState("")
  useEffect(() => {
    const getAndSetWord = async () => {
      const todaysWord = await BackendService.getTodaysWord()
      setWord(todaysWord)
    }
    getAndSetWord()
  }, [])
  return <WordContext.Provider value={word}>{children}</WordContext.Provider>
}
